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
    const { Comment_User_Name,Comment_User_NickName, Book_ID, Book_Name, Comment_Content,Comment_Time } = req.body;

    if (!Comment_User_Name || !Book_ID || !Book_Name || !Comment_Content) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [Comment_User_Name]);
     // 检查书籍是否已存在
     const [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
    if (existingUsers.length > 0&&existingBooks.length > 0) {
     
    }else{
      return res.status(400).json({ error: '用户或书籍bucu' });
    }
   



    // 插入新用户
    const [result] = await pool.query('INSERT INTO user (User_Name, Email, PassWord, NickName) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, nickname]);

    // 创建JWT令牌
    const token = jwt.sign({ userId: result.insertId }, secretKey, { expiresIn: '1h' });

    res.json({ message: '用户注册成功', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户注册失败' });
  }
});


module.exports = router;