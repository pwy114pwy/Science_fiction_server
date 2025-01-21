const { Router } = require('express');
const pool = require('../db');

const router = Router();
// 获取用户的所有浏览记录
router.post('/api/getAllBrowseHistory', async (req, res) => {
  try {
    const { User_Name } = req.body;

    if (!User_Name) {
      return res.status(400).json({ error: '用户名是必填的' });
    }

    const [results] = await pool.query(
      'SELECT * FROM history WHERE User_Name = ?',
      [User_Name]
    );

    // if (results.length === 0) {
    //   return res.status(500).json({ error: '该用户没有浏览记录' });
    //   // return res.json({ message: '该用户没有浏览记录' });
    // }

    // return res.json({ message: '浏览记录获取成功', data: results });
    return res.json(results);
  } catch (error) {
    console.error('Error getting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
// 获取用户的所有浏览记录
router.post('/api/getAllBrowseHistory', async (req, res) => {
  try {
    const { User_Name } = req.body;

    if (!User_Name) {
      return res.status(400).json({ error: '用户名是必填的' });
    }

    const [results] = await pool.query(
      'SELECT * FROM history WHERE User_Name = ?',
      [User_Name]
    );

    // if (results.length === 0) {
    //   return res.status(500).json({ error: '该用户没有浏览记录' });
    //   // return res.json({ message: '该用户没有浏览记录' });
    // }

    // return res.json({ message: '浏览记录获取成功', data: results });
    return res.json(results);
  } catch (error) {
    console.error('Error getting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

//插入新的浏览记录
router.post('/api/InsertBrowseHistory', async (req, res) => {
  try {
    const { User_Name, Book_ID, Book_Name, Browse_Time, Img_Url } = req.body;

    if (!User_Name || !Book_ID || !Book_Name || !Browse_Time || !Img_Url) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查记录是否存在
    const [existingRecord] = await pool.query(
      'SELECT * FROM history WHERE User_Name = ? AND Book_ID = ?',
      [User_Name, Book_ID]
    );

    if (existingRecord.length > 0) {
      const [updateResult] = await pool.query(
        'UPDATE history SET Browse_Time = ? WHERE User_Name = ? AND Book_ID = ?',
        [Browse_Time, User_Name, Book_ID]
      );

      if (updateResult.affectedRows > 0) {
        return res.json({ message: '浏览记录更新成功' });
      } else {
        return res.status(400).json({ error: '更新浏览记录失败' });
      }
    } else {
      // 插入新的浏览记录
      const [insertResult] = await pool.query(
        'INSERT INTO history (User_Name, Book_ID, Book_Name, Browse_Time, Img_Url) VALUES (?, ?, ?, ?, ?)',
        [User_Name, Book_ID, Book_Name, Browse_Time, Img_Url]
      );

      if (insertResult.affectedRows > 0) {
        return res.json({ message: '浏览记录添加成功' });
      } else {
        return res.status(400).json({ error: '添加浏览记录失败' });
      }
    }
  } catch (error) {
    console.error('Error browsing history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

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