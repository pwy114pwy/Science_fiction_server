const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getScience', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM science WHERE Illustrated_ID = ?', [Illustrated_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});


// 添加或更新科技
router.post('/api/addScience', async (req, res) => {
  try {
    const { Science_ID, Illustrated_ID, Illustrated_Name, Science_Name, Science_N } = req.body;

    if (Worldview_ID) { // 更新操作
      // 更新关系信息
      await pool.query(
        `UPDATE worldview SET Illustrated_ID=?,Illustrated_Name=?, Worldview_Title=?,Worldview_Description=?
          WHERE Worldview_ID = ?`,
        [Illustrated_ID, Illustrated_Name, Worldview_Title, Worldview_Description, Worldview_ID]
      );
      return res.json({ success: true, message: '世界观更新成功' });
    } else { // 添加操作
      // 插入新事件
      await pool.query(
        `INSERT INTO worldview (Illustrated_ID,Illustrated_Name,Worldview_Title,Worldview_Description) VALUES (?,?,?,?)`,
        [Illustrated_ID, Illustrated_Name, Worldview_Title, Worldview_Description]
      );
      return res.json({ success: true, message: '世界观添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

//删除世界观
router.post('/api/delWorldview', async (req, res) => {
  try {
    const { Worldview_ID } = req.body;

    if (!Worldview_ID) {
      return res.status(400).json({ error: '世界观ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM worldview WHERE Worldview_ID = ?',
      [Worldview_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '世界观删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的世界观' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
module.exports = router;