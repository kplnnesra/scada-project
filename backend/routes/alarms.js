const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin, verifyRegionManager } = require('../middleware/auth');

// Tüm alarmları getir
router.get('/', verifyToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query('SELECT * FROM alarms ORDER BY created_at DESC');
    } else if (req.user.role === 'region_manager') {
      result = await db.query(
        `SELECT a.* FROM alarms a 
         JOIN meters m ON a.meter_id = m.id 
         WHERE m.region_id = (SELECT region_id FROM users WHERE id = $1)
         ORDER BY a.created_at DESC`,
        [req.user.id]
      );
    } else {
      result = await db.query(
        `SELECT a.* FROM alarms a 
         JOIN meters m ON a.meter_id = m.id 
         WHERE m.subscriber_id = $1
         ORDER BY a.created_at DESC`,
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alarm oluştur
router.post('/', verifyToken, async (req, res) => {
  const { meter_id, message, type } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO alarms (meter_id, message, type) VALUES ($1, $2, $3) RETURNING *',
      [meter_id, message, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alarm kapat
router.put('/:id/close', verifyToken, verifyRegionManager, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE alarms SET status = $1 WHERE id = $2 RETURNING *',
      ['closed', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alarm sil (admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM alarms WHERE id = $1', [req.params.id]);
    res.json({ message: 'Alarm silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;