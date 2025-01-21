const { Router } = require('express');
const pool = require('../db');
const router = Router();

// 添加或更新图鉴
router.post('/api/AddIllustrated', async (req, res) => {
  try {
    const { Illustrated_ID, Book_ID, Book_Name, Illustrated_Img } = req.body;

    // 检查作者是否存在，若不存在则创建新作者
    let [authorResult] = await pool.query('SELECT * FROM author WHERE Author_Name = ?', [Author]);
    // let Author_ID;
    // if (authorResult.length === 0) {
    //   // 如果作者不存在，则插入新作者并获取生成的ID
    //   [result] = await pool.query('INSERT INTO author (Author_Name) VALUES (?)', [Author]);
    //   authorID = result.insertId;
    // } else {
    // Author_ID = authorResult[0].Author_ID;
    // }

    if (Illustrated_ID) { // 更新操作
      // 更新图鉴信息
      await pool.query(
        'UPDATE illustrated SET Book_Name = ?,Illustrated_Img = ? WHERE Illustrated_ID = ?',
        [Book_Name,Illustrated_Img,Illustrated_ID]
      );
      return res.json({ success: true, message: '图鉴更新成功' });
    } else { // 添加操作
      // 检查书籍是否已存在
      let [existingIllustrated] = await pool.query('SELECT * FROM illustrated WHERE Book_Name = ?', [Book_Name]);
      if (existingIllustrated.length > 0) {
        return res.status(400).json({ error: '书籍已存在' });
      }
      // 插入新图鉴
      await pool.query(
        'INSERT INTO illustrated (Book_Name,Illustrated_Img) VALUES (?, ?)',
        [Book_Name,Illustrated_Img]
      );
      return res.json({ success: true, message: '图鉴添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;