const { Router } = require('express');
const pool = require('../db');

const router = Router();



// 删除用户的浏览记录
router.post('/api/deleteBrowseHistory', async (req, res) => {
  try {
    const { User_Name, Book_ID } = req.body;

    if (!User_Name || !Book_ID) {
      return res.status(400).json({ error: '用户名和书籍ID是必填的' });
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

// 清空所有浏览记录
router.post('/api/clearAllBrowseHistory', async (req, res) => {
  try {
    const { User_Name } = req.body;

    if (!User_Name) {
      return res.status(400).json({ error: '用户名是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM history WHERE User_Name = ?',
      [User_Name]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '清空记录成功' });
    } else {
      return res.status(404).json({ error: '用户没有浏览记录' });
    }
  } catch (error) {
    console.error('Error clearing all browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});


module.exports = router;