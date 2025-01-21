const { Router } = require('express');
const pool = require('../db');

const router = Router();



// 删除用户的浏览记录
router.post('/api/DelBook', async (req, res) => {
  try {
    const { Book_ID } = req.body;

    if (!Book_ID) {
      return res.status(400).json({ error: '书籍ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM history WHERE User_Name = ? AND Book_ID = ?',
      [User_Name, Book_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '浏览记录删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的浏览记录' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});



module.exports = router;