const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/api/Recommend', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM book where ta');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recommend' });
  }
});

module.exports = router;