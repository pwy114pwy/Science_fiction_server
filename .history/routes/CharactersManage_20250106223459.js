const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getCharacters', async (req, res) => {
  
  try {
    let { Illustrated_ID } = req.body;
    console.log()
    const [rows] = await pool.query('SELECT * FROM characters WHERE Illustrated_ID = ?',[Illustrated_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

module.exports = router;