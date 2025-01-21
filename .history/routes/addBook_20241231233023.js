const { Router } = require('express');
const pool = require('../db');
const router = Router();
// 添加书籍
router.post('/api/AddBook', async (req, res) => {
  try {
    const { Book_Name, Tag, Topic, Author, Rating, Book_introduce,Img_Url } = req.body;


    // 检查书籍是否已存在
    const [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
    if (existingBooks.length > 0) {
      return res.status(400).json({ error: '书籍已存在' });
    } else {
      //查找作者ID
      const [authorID] = await pool.query('SELECT Authod_ID FROM author WHERE Author_Name = ?', [Author]);
      log
      // 添加书籍
      // const [result] = await pool.query('INSERT INTO book (Book_Name, Tag, Topic, Author, Rating, Book_introduce,Img_Url) VALUES (?,?, ?, ?, ?, ?)', [Book_ID, Book_Name, Comment_User_Name, Comment_User_NickName, Comment_Time, Comment_Content]);


      res.json({ message: '用户评论成功' });
      
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户评论失败' });
  }
});
module.exports = router;