const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    const { Character_ID } = req.body;

    // 查询角色信息及图片，使用JOIN减少查询次数
    const query = `
      SELECT 
        CASE WHEN From_CharacterID = ? THEN To_CharacterID ELSE From_CharacterID END AS realtion_ID,
        CASE WHEN From_CharacterID = ? THEN To_Name ELSE From_Name END AS realtion_Name,
        c.Role_Image AS realtion_Image,
        r.Relation_Type
      FROM relationships r
      JOIN characters c ON 
        (r.From_CharacterID = c.Character_ID OR r.To_CharacterID = c.Character_ID)
      WHERE r.From_CharacterID = ? OR r.To_CharacterID = ?
    `;

    const [characters] = await pool.query(query, [
      Character_ID, Character_ID, Character_ID, Character_ID
    ]);

    // 返回响应
    res.json({ data: characters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships', data: null });
  }
});

module.exports = router;