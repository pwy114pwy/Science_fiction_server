const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.post('/api/GetDetailBook', async (req, res) => {
  try {
    
    
    const {bookId} = req.body;

    if (!bookId) {
      return res.status(400).json({ error: 'Missing bookId parameter' });
    }

    const [rows] = await pool.query('SELECT * FROM book WHERE Book_Id = ?', [bookId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    log
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Error fetching book' });
  }
});

module.exports = router;