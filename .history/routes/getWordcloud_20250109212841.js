const { Router } = require('express');
const pool = require('../db');

const router = Router();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
router.get('/api/getAllBooks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM book');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

module.exports = router;