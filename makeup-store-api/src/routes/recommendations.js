const express = require('express');
const { getDatabase } = require('../database');

const router = express.Router();

// GET /api/recommendations - Obtener recomendaciones por perfil de piel
router.get('/', (req, res) => {
  const db = getDatabase();
  const { skin_tone, skin_type } = req.query;

  let query = 'SELECT * FROM recommendations WHERE 1=1';
  const params = [];

  if (skin_tone) {
    query += ' AND (skin_tone = ? OR skin_tone IS NULL)';
    params.push(skin_tone);
  }
  if (skin_type) {
    query += ' AND (skin_type = ? OR skin_type IS NULL)';
    params.push(skin_type);
  }

  const recommendations = db.prepare(query).all(...params);
  res.json(recommendations);
});

// POST /api/recommendations - Crear una recomendación
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name, brand, description, image, skin_tone, skin_type } = req.body;

  if (!name || !brand || !description) {
    return res.status(400).json({ error: 'Faltan campos requeridos: name, brand, description' });
  }

  const result = db.prepare(`
    INSERT INTO recommendations (name, brand, description, image, skin_tone, skin_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, brand, description, image || null, skin_tone || null, skin_type || null);

  const rec = db.prepare('SELECT * FROM recommendations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(rec);
});

module.exports = router;
