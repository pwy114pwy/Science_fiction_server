const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getEvents', async (req, res) => {

  try {
    let { Illustrated_ID } = req.body;
    const [rows] = await pool.query('SELECT * FROM event WHERE Illustrated_ID = ?', [Illustrated_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});


// 添加或更新关系
router.post('/api/AddRelationship', async (req, res) => {
  try {
    const { ImportantEvent_ID, Illustrated_ID, Illustrated_Name,Event_Time,Event_Description,Event_Value  } = req.body;

    if (ImportantEvent_ID) { // 更新操作
      // 更新关系信息
      await pool.query(
        `UPDATE event SET Illustrated_ID=?,Illustrated_Name=?, Event_Time=?,Event_Description=?,Event_Value=?
          WHERE ImportantEvent_ID = ?`,
        [Illustrated_ID,Illustrated_Name,Event_Time,Event_Description,Event_Value]
      );
      return res.json({ success: true, message: '事件更新成功' });
    } else { // 添加操作
      // 插入新事件
      await pool.query(
        `INSERT INTO event (Illustrated_ID,Illustrated_Name,Event_Time,Event_Description,Event_Value) VALUES (?,?,?,?,?)`,
          [Illustrated_ID,Illustrated_Name,Event_Time,Event_Description,Event_Value]
      );
      return res.json({ success: true, message: 's添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

//删除关系
router.post('/api/Delrelationship', async (req, res) => {
  try {
    const { Relationship_ID } = req.body;
    
    if (!Relationship_ID) {
      return res.status(400).json({ error: '关系ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM relationships WHERE Relationship_ID = ?',
      [Relationship_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '关系删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的关系' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
module.exports = router;