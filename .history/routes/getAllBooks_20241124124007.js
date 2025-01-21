const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/api/getABooks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM book');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

module.exports = router;