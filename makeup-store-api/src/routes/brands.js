const express = require('express');
const { getDatabase } = require('../database');

const router = express.Router();

// GET /api/brands - Obtener todas las marcas
router.get('/', (req, res) => {
  const db = getDatabase();
  const brands = db.prepare('SELECT * FROM brands ORDER BY name').all();
  res.json(brands);
});

// GET /api/brands/:id - Obtener una marca por ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(req.params.id);
  if (!brand) {
    return res.status(404).json({ error: 'Marca no encontrada' });
  }
  res.json(brand);
});

// POST /api/brands - Crear una marca
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'El campo name es requerido' });
  }

  try {
    const result = db.prepare('INSERT INTO brands (name) VALUES (?)').run(name);
    const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(brand);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'La marca ya existe' });
    }
    throw err;
  }
});

// DELETE /api/brands/:id - Eliminar una marca
router.delete('/:id', (req, res) => {
  const db = getDatabase();

  const products = db.prepare('SELECT COUNT(*) as count FROM products WHERE brand_id = ? AND active = 1').get(req.params.id);
  if (products.count > 0) {
    return res.status(400).json({ error: 'No se puede eliminar: la marca tiene productos activos' });
  }

  const result = db.prepare('DELETE FROM brands WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Marca no encontrada' });
  }
  res.json({ message: 'Marca eliminada correctamente' });
});

module.exports = router;
