const { Router } = require('express');
const pool = require('../db');
const router = Router();
// 添加书籍
router.post('/api/AddBook', async (req, res) => {
  try {
    const { Book_Name, Tag, Topic, Author, Rating, Book_introduce,Img_Url } = req.body;


    // 检查书籍是否已存在
    const [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
    if (existingUsers.length > 0 && existingBooks.length > 0) {
      
    } else {
      return res.status(400).json({ error: '用户或书籍不存在' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户评论失败' });
  }
});
module.exports = router;