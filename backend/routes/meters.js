const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin, verifyRegionManager } = require('../middleware/auth');

// Tüm sayaçları getir
router.get('/', verifyToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query('SELECT * FROM meters');
    } else if (req.user.role === 'region_manager') {
      result = await db.query('SELECT * FROM meters WHERE region_id = (SELECT region_id FROM users WHERE id = $1)', [req.user.id]);
    } else {
      result = await db.query('SELECT * FROM meters WHERE subscriber_id = $1', [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sayaç ekle (admin)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, type, location, subscriber_id, region_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO meters (name, type, location, subscriber_id, region_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, type, location, subscriber_id, region_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sayaç sil (admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM meters WHERE id = $1', [req.params.id]);
    res.json({ message: 'Sayaç silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sayaç okuma ekle
router.post('/:id/readings', verifyToken, async (req, res) => {
  const { value, unit } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO readings (meter_id, value, unit) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, value, unit]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sayaç okumalarını getir
router.get('/:id/readings', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM readings WHERE meter_id = $1 ORDER BY recorded_at DESC LIMIT 50',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;