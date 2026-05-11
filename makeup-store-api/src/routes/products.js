const express = require('express');
const { getDatabase } = require('../database');

const router = express.Router();

// GET /api/products - Obtener todos los productos (con filtros opcionales)
router.get('/', (req, res) => {
  const db = getDatabase();
  const { brand, category, active } = req.query;

  let query = `
    SELECT p.id, p.name, b.name as brand, c.display_name as category,
           p.price, p.image, p.description, p.stock, p.active
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (brand) {
    query += ' AND b.name = ?';
    params.push(brand);
  }
  if (category) {
    query += ' AND c.name = ?';
    params.push(category);
  }
  if (active !== undefined) {
    query += ' AND p.active = ?';
    params.push(Number(active));
  } else {
    query += ' AND p.active = 1';
  }

  query += ' ORDER BY p.name';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const product = db.prepare(`
    SELECT p.id, p.name, b.name as brand, c.display_name as category,
           p.price, p.image, p.description, p.stock, p.active
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

// POST /api/products - Crear un producto
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name, brand_id, category_id, price, image, description, stock } = req.body;

  if (!name || !brand_id || !category_id || price == null) {
    return res.status(400).json({ error: 'Faltan campos requeridos: name, brand_id, category_id, price' });
  }

  const result = db.prepare(`
    INSERT INTO products (name, brand_id, category_id, price, image, description, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, brand_id, category_id, price, image || null, description || null, stock || 0);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(product);
});

// PUT /api/products/:id - Actualizar un producto
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { name, brand_id, category_id, price, image, description, stock, active } = req.body;

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  db.prepare(`
    UPDATE products SET
      name = COALESCE(?, name),
      brand_id = COALESCE(?, brand_id),
      category_id = COALESCE(?, category_id),
      price = COALESCE(?, price),
      image = COALESCE(?, image),
      description = COALESCE(?, description),
      stock = COALESCE(?, stock),
      active = COALESCE(?, active),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name ?? null, brand_id ?? null, category_id ?? null, price ?? null,
    image ?? null, description ?? null, stock ?? null, active ?? null,
    req.params.id
  );

  const updated = db.prepare(`
    SELECT p.id, p.name, b.name as brand, c.display_name as category,
           p.price, p.image, p.description, p.stock, p.active
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);

  res.json(updated);
});

// DELETE /api/products/:id - Eliminar un producto (soft delete)
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Producto desactivado correctamente' });
});

module.exports = router;
