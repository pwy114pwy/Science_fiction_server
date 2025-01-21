const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.get('/api/getCharacters', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM characters WHERE Illustrated_');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

module.exports = router;