const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.post('/api/SearchBook', async (req, res) => {
  try {
    console.log(req.body);
    const { keyword, tag } = req.body;

    let query = 'SELECT * FROM book WHERE ';
    let params = [];

    if (keyword) {
      query += '(Book_Name LIKE ? OR Author LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (tag) {
      if (keyword) {
        query += ' AND ';
      } else {
        query += ' T LIKE ?';
      }
      params.push(`%${tag}%`);
    }
    console.log(query)
    console.log(params)

    if (!params.length) {
      return res.status(400).json({ error: 'No search criteria provided' });
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No books found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

module.exports = router;