const express = require('express');
const { getDatabase } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDatabase();
  const orders = db.prepare(`
    SELECT o.id, o.total, o.status, o.created_at,
           u.name AS customer_name, u.email AS customer_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT 50
  `).all();

  res.json(orders);
});

router.post('/', (req, res) => {
  const db = getDatabase();
  const { customer, items } = req.body;

  if (!customer || typeof customer.name !== 'string' || typeof customer.email !== 'string') {
    return res.status(400).json({ error: 'Faltan los datos del cliente: name y email son requeridos.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El pedido debe incluir al menos un producto.' });
  }

  const cleanedEmail = customer.email.trim().toLowerCase();
  const customerName = customer.name.trim();

  const normalizedItems = items.map(item => ({
    product_id: Number(item.product_id),
    quantity: Number(item.quantity),
  }));

  if (normalizedItems.some(item => !Number.isInteger(item.product_id) || item.product_id <= 0)) {
    return res.status(400).json({ error: 'Cada item debe tener un product_id válido.' });
  }

  if (normalizedItems.some(item => !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return res.status(400).json({ error: 'Cada item debe tener una cantidad válida mayor a 0.' });
  }

  const uniqueProductIds = [...new Set(normalizedItems.map(item => item.product_id))];
  const placeholders = uniqueProductIds.map(() => '?').join(', ');
  const products = db.prepare(`SELECT id, price, stock, active FROM products WHERE id IN (${placeholders})`).all(...uniqueProductIds);

  if (products.length !== uniqueProductIds.length) {
    return res.status(400).json({ error: 'Uno o más productos del pedido no existen.' });
  }

  const productMap = new Map(products.map(product => [product.id, product]));

  const validatedItems = normalizedItems.map(item => {
    const product = productMap.get(item.product_id);
    if (!product || product.active !== 1) {
      throw new Error('Uno o más productos no están disponibles.');
    }
    if (item.quantity > product.stock) {
      throw new Error(`No hay suficiente stock para el producto ID ${item.product_id}.`);
    }
    return {
      ...item,
      unit_price: product.price,
    };
  });

  const total = validatedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  try {
    const orderTransaction = db.transaction(() => {
      db.prepare('INSERT OR IGNORE INTO users (email, name) VALUES (?, ?)').run(cleanedEmail, customerName);
      const user = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanedEmail);
      const orderResult = db.prepare('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)').run(user.id, total, 'pendiente');
      const orderId = orderResult.lastInsertRowid;

      const insertOrderItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
      );
      const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      for (const item of validatedItems) {
        insertOrderItem.run(orderId, item.product_id, item.quantity, item.unit_price);
        updateStock.run(item.quantity, item.product_id);
      }

      return orderId;
    });

    const orderId = orderTransaction();
    const order = db.prepare('SELECT id, total, status, created_at FROM orders WHERE id = ?').get(orderId);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Error al procesar el pedido.' });
  }
});

module.exports = router;
