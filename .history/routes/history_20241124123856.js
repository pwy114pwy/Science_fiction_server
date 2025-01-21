const { Router } = require('express');
const pool = require('../db');

const router = Router();


//收藏书籍
router.post('/api/CollectBook', async (req, res) => {
  try {
    console.log(req.body)
    const { User_Name, Book_ID, Book_Name, Collect_Time,Img_Url } = req.body;

    if (!User_Name || !Book_ID || !Book_Name || !Collect_Time||!Img_Url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 检查记录是否存在
    const [existingRecord] = await pool.query(
      'SELECT * FROM collect WHERE User_Name = ? AND Book_ID = ?',
      [User_Name, Book_ID]
    );

    if (existingRecord.length > 0) {
      return res.status(400).json({ error: '该用户已收藏此书' });
    }


    // // 插入收藏
    const [result] = await pool.query('INSERT INTO collect (User_Name, Book_ID, Book_Name, Collect_Time, Img_Url) VALUES (?, ?, ?, ?,?)', [User_Name, Book_ID, Book_Name, Collect_Time,Img_Url]);


    res.json({ message: '用户收藏成功' });
  } catch (error) {
    console.error('Error collecting book:', error);
    res.status(500).json({ error: 'Error collecting book' });
  }
})