const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/api/getAllAuthors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM author');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// 添加或更新作者
router.post('/api/AddBook', async (req, res) => {
  try {
    const { Author_ID, Author_Name, Author_Introduce } = req.body;

    if (Author_ID) { // 更新操作
      // 更新书籍信息
      await pool.query(
        'UPDATE author SET Author_Name = ?,Author_Introduce = ? WHERE Book_ID = ?',
        [Author_Name, Author_Introduce Book_ID]
      );
      return res.json({ success: true, message: '书籍更新成功' });
    } else { // 添加操作
      // 检查书籍是否已存在
      [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
      if (existingBooks.length > 0) {
        return res.status(400).json({ error: '书籍已存在' });
      }
      // 插入新书籍
      await pool.query(
        'INSERT INTO book (Book_Name, Tag, Topic, Author_ID, Rating, Book_Introduce, Img_Url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Book_Name, Tag, Topic, Author_ID, Rating, Book_Introduce, Img_Url]
      );
      return res.json({ success: true, message: '书籍添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;