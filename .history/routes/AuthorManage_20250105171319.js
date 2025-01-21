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
router.post('/api/AddAuthor', async (req, res) => {
  try {
    const { Author_ID, Author_Name, Author_Introduction } = req.body;

    if (Author_ID) { // 更新操作
      // 更新书籍信息
      await pool.query(
        'UPDATE author SET Author_Name = ?,Author_Introduction = ? WHERE Author_ID = ?',
        [Author_Name, Author_Introduction, Author_ID]
      );
      return res.json({ success: true, message: '作者更新成功' });
    } else { // 添加操作
      // 检查书籍是否已存在
      let [existingAuthors] = await pool.query('SELECT * FROM author WHERE Author_Name = ?', [Author_Name]);
      if (existingAuthors.length > 0) {
        return res.status(400).json({ error: '作者已存在' });
      }
      // 插入新作者
      await pool.query(
        'INSERT INTO author (Author_Name,Author_Introduction) VALUES (?, ?)',
        [Author_Name, Author_Introduction]
      );
      return res.json({ success: true, message: '作者添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});


// 删除作者
router.post('/api/DelA', async (req, res) => {
  try {
    const { Book_ID } = req.body;
    console.log(Book_ID);
    
    if (!Book_ID) {
      return res.status(400).json({ error: '书籍ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM book WHERE Book_ID = ?',
      [Book_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '书籍删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的书籍' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;