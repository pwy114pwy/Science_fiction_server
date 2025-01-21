const { Router } = require('express');
const pool = require('../db');

const router = Router();

// 中间件：验证 bookId 是否有效（假设 Book_Id 是整数）
function validateBookId(req, res, next) {
  const { bookId } = req.body;
  if (!bookId || typeof bookId !== 'number' || bookId <= 0) {
    return res.status(400).json({ error: 'Invalid bookId parameter' });
  }
  next();
}

router.post('/api/GetDetailBook', validateBookId, async (req, res) => {
  try {
    const { bookId } = req.body;

    // 查询书籍信息
    const [bookRows] = await pool.query('SELECT * FROM book WHERE Book_Id = ?', [bookId]);

    if (bookRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const book = bookRows[0];

    // 根据书籍中的 Author 查找作者简介

    const [authorRows] = await pool.query('SELECT Author_Introduction FROM author WHERE Author_Name = ?', [book.Author]);
    let authorIntroduction = null;
    if (authorRows.length > 0) {
      authorIntroduction = authorRows[0].Author_Introduction;
    }

    //查找书籍评论
    console.log(bookId)
    const [commentRows] = await pool.query('SELECT * FROM comment WHERE Book_ID = ?', [bookId]);
    // console.log(commentRows)
    let bookIntroduction = null;
    if (commentRows.length > 0) {
    //   bookComment = commentRows[0].Author_Introduction;
    // }

    // console.log('Fetched book:', book);
    // console.log('Fetched author introduction:', authorIntroduction);

    res.json({
      success: true,
      data: {
        ...book,
        Author_Introduction: authorIntroduction
      }
    });

  } catch (error) {
    console.error('Error fetching book and author details:', error);
    res.status(500).json({ success: false, error: 'Error fetching book and author details' });
  }
});

module.exports = router;