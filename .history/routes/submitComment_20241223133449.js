const { Router } = require('express');
const pool = require('../db');
const router = Router();


// 发表评论
router.post('/api/AddBookComment', async (req, res) => {
  try {
    const { Comment_User_Name, Comment_User_NickName, Book_ID, Book_Name, Comment_Content, Comment_Time } = req.body;

    if (!Comment_User_Name || !Book_ID || !Book_Name || !Comment_Content) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [Comment_User_Name]);
    // 检查书籍是否已存在
    const [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
    if (existingUsers.length > 0 && existingBooks.length > 0) {
      // 插入评论
      const [result] = await pool.query('INSERT INTO comment (Book_ID,Book_Name, Comment_User_Name, Comment_User_NickName, Comment_Time,Comment_Content) VALUES (?,?, ?, ?, ?, ?)', [Book_ID, Book_Name, Comment_User_Name, Comment_User_NickName, Comment_Time, Comment_Content]);


      res.json({ message: '用户评论成功' });
    } else {
      return res.status(400).json({ error: '用户或书籍不存在' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户评论失败' });
  }
});

// 删除评论
router.post('/api/DeleteBookComment', async (req, res) => {
  try {
    const { Comment_User_Name, Book_Comment_ID } = req.body;

    if (!Comment_User_Name || !Book_Comment_ID) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [Comment_User_Name]);
    // 检查评论是否已存在
    const [existingComments] = await pool.query('SELECT * FROM comment WHERE Book_Comment_ID = ?', [Book_Comment_ID]);
    if (existingUsers.length > 0 && existingComments.length > 0) {
      //删除评论
      const [deleteResult] = await pool.query(
        'DELETE FROM comment WHERE User_Name = ? AND Book_ID = ?',
        [User_Name, Book_ID]
      );


      res.json({ message: '用户评论成功' });
    } else {
      return res.status(400).json({ error: '用户或书籍不存在' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户评论失败' });
  }
});


module.exports = router;