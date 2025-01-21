const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getRelationships', async (req, res) => {

  try {
    let { Illustrated_ID } = req.body;
    const [rows] = await pool.query('SELECT * FROM relationships WHERE Illustrated_ID = ?', [Illustrated_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});


// 添加或更新关系
router.post('/api/AddRelationship', async (req, res) => {
  try {
    const { Relationship_ID, Illustrated_ID, Illustrated_Name,From_Name,To_Name,Relation_Type  } = req.body;
    let [from_ID]=await pool.query("SELECT Character_ID FROM characters WHERE Role_Name = ?",[From_Name])
    let [to_ID]=await pool.query("SELECT Character_ID FROM characters WHERE Role_Name = ?",[To_Name])

    // console.log(from_ID[0].Character_ID)
    // console.log(to_ID[0].Character_ID)
    let From_CharacterID=from_ID[0].Character_ID
    let To_CharacterID=to_ID[0].Character_ID
    if (Relationship_ID) { // 更新操作
      // 更新关系信息
      await pool.query(
        `UPDATE relationships SET Illustrated_ID=?,Illustrated_Name=?, From_CharacterID=?,From_Name=?,To_CharacterID=?,To_Name=?,Relation_Type=?
          WHERE Relationship_ID = ?`,
        [Illustrated_ID,Illustrated_Name,From_CharacterID,From_Name,To_CharacterID,To_Name,Relation_Type,Relationship_ID]
      );
      return res.json({ success: true, message: '关系更新成功' });
    } else { // 添加操作
      // 插入新关系
      await pool.query(
        `INSERT INTO relationships (Illustrated_ID,Illustrated_Name，From_CharacterID,From_Name,To_CharacterID,To_Name,Relation_Type) VALUES (?,?,?,?,?)`,
          [From_CharacterID,From_Name,To_CharacterID,To_Name,Relation_Type]
      );
      return res.json({ success: true, message: '关系添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

//删除角色
router.post('/api/Delcharacter', async (req, res) => {
  try {
    const { Character_ID } = req.body;
    
    if (!Character_ID) {
      return res.status(400).json({ error: '角色ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM characters WHERE Character_ID = ?',
      [Character_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '角色删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的角色' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
module.exports = router;