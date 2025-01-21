const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getWorldviews', async (req, res) => {

  try {
    let { Worldview_ID } = req.body;
    const [rows] = await pool.query('SELECT * FROM event WHERE Worldview_ID = ?', [Worldview_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});


// 添加或更新关系
router.post('/api/addEvent', async (req, res) => {
  try {
    const { Worldview_ID, Illustrated_ID, Illustrated_Name,Worldview_Title,Worldview_Description } = req.body;

    if (Worldview_ID) { // 更新操作
      // 更新关系信息
      await pool.query(
        `UPDATE event SET Illustrated_ID=?,Illustrated_Name=?, Worldview_Title=?,Worldview_Description=?
          WHERE Worldview_ID = ?`,
        [Illustrated_ID,Illustrated_Name,Worldview_Title,Worldview_Description,Worldview_ID]
      );
      return res.json({ success: true, message: '世界观更新成功' });
    } else { // 添加操作
      // 插入新事件
      await pool.query(
        `INSERT INTO event (Illustrated_ID,Illustrated_Name,Worldview_Title,Worldview_Description) VALUES (?,?,?,?)`,
          [Illustrated_ID,Illustrated_Name,Worldview_Title,Worldview_Description]
      );
      return res.json({ success: true, message: '世界观添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

//删除世界观
router.post('/api/delEvent', async (req, res) => {
  try {
    const { ImportantEvent_ID } = req.body;
    
    if (!ImportantEvent_ID) {
      return res.status(400).json({ error: '事件ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM event WHERE ImportantEvent_ID = ?',
      [ImportantEvent_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '事件删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的事件' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
module.exports = router;