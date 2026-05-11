const express = require('express');
const { getDatabase } = require('../database');

const router = express.Router();

// GET /api/categories - Obtener todas las categorías
router.get('/', (req, res) => {
  const db = getDatabase();
  const categories = db.prepare('SELECT * FROM categories ORDER BY display_name').all();
  res.json(categories);
});

// POST /api/categories - Crear una categoría
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name, display_name } = req.body;
  if (!name || !display_name) {
    return res.status(400).json({ error: 'Los campos name y display_name son requeridos' });
  }

  try {
    const result = db.prepare('INSERT INTO categories (name, display_name) VALUES (?, ?)').run(name, display_name);
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(category);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'La categoría ya existe' });
    }
    throw err;
  }
});

module.exports = router;
