const { Router } = require('express');
const pool = require('../db');
const router = Router();

// 添加或更新书籍
router.post('/api/AddBook', async (req, res) => {
  try {
    const { Book_ID, Book_Name, Tag, Topic, Author, Rating, Book_Introduce, Img_Url } = req.body;

    // 检查作者是否存在，若不存在则创建新作者
    // let [authorResult] = await pool.query('SELECT * FROM author WHERE Author_Name = ?', [Author]);
    // let authorID;
    // if (authorResult.length === 0) {
    //   // 如果作者不存在，则插入新作者并获取生成的ID
    //   [result] = await pool.query('INSERT INTO author (Author_Name) VALUES (?)', [Author]);
    //   authorID = result.insertId;
    // } else {
    //   authorID = authorResult[0].Author_ID;
    // }

    if (Book_ID) { // 更新操作
      // 更新书籍信息
      await pool.query(
        'UPDATE book SET Book_Name = ?, Tag = ?, Topic = ?, Author_ID = ?, Rating = ?, Book_Introduce = ?, Img_Url = ? WHERE Book_ID = ?',
        [Book_Name, Tag, Topic, authorID, Rating, Book_Introduce, Img_Url, id]
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
        [Book_Name, Tag, Topic, authorID, Rating, Book_Introduce, Img_Url]
      );
      return res.json({ success: true, message: '书籍添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;