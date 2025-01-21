const { Router } = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'abc123';
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
      const [result] = await pool.query('INSERT INTO comment (Book_Name, Comment_User_Name, Comment_User_NickName, Comment_Time,Comment_Content) VALUES (?, ?, ?, ?, ?)', [Book_Name, Comment_User_Name, Comment_User_NickName, Comment_Time,Comment_Content]);


      res.json({ message: '用户注册成功'});
    } else {
      return res.status(400).json({ error: '用户或书籍不存在' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户注册失败' });
  }
});


module.exports = router;