const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Tüm kullanıcıları getir (sadece admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, region_id, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcı sil (sadece admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcı güncelle
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { name, email, role, region_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name=$1, email=$2, role=$3, region_id=$4 WHERE id=$5 RETURNING id, name, email, role',
      [name, email, role, region_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;