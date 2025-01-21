const { Router } = require('express');
const pool = require('../db');

const router = Router();

//获取suo收藏书籍
router.post('/api/getUserCollectBook', async (req, res) => {
  try {
    const { User_Name } = req.body;
    // console.log(User_Name)
    const [rows] = await pool.query('SELECT * FROM collect where User_Name = ?',[User_Name]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collect' });
  }
});
//获取用户收藏书籍
router.post('/api/getUserCollectBook', async (req, res) => {
  try {
    const { User_Name } = req.body;
    // console.log(User_Name)
    const [rows] = await pool.query('SELECT * FROM collect where User_Name = ?',[User_Name]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collect' });
  }
});


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

//取消收藏
router.post('/api/UnCollectBook', async (req, res) => {
  try {
    console.log(req.body);
    const { User_Name, Book_ID } = req.body;

    if (!User_Name || !Book_ID) {
      return res.status(400).json({ error: 'User_Name and Book_ID are required' });
    }

    // 检查记录是否存在
    const [existingRecord] = await pool.query(
      'SELECT * FROM collect WHERE User_Name = ? AND Book_ID = ?',
      [User_Name, Book_ID]
    );

    if (existingRecord.length === 0) {
      return res.status(400).json({ error: '该用户未收藏此书' });
    }

    // 删除收藏
    const [result] = await pool.query(
      'DELETE FROM collect WHERE User_Name = ? AND Book_ID = ?',
      [User_Name, Book_ID]
    );

    res.json({ message: '用户取消收藏成功' });
  } catch (error) {
    console.error('Error uncollecting book:', error);
    res.status(500).json({ error: 'Error uncollecting book' });
  }
});

module.exports = router;