const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    const { Character_ID } = req.body;

    if (!Character_ID) {
      return res.status(400).json({ error: 'Character_ID is required', data: null });
    }

    // 查询角色信息
    const [characters] = await pool.query(
      'SELECT * FROM relationships WHERE From_CharacterID = ? OR To_CharacterID = ?', 
      [Character_ID, Character_ID]
    );

    const relatedCharacters = [];

    for (const element of characters) {
      let relatedID, relatedName;
      if (element.From_CharacterID === Character_ID) {
        relatedID = element.To_CharacterID;
        relatedName = element.To_Name;
      } else {
        relatedID = element.From_CharacterID;
        relatedName = element.From_Name;
      }

      const [characters_img] = await pool.query(
        'SELECT Role_Image FROM characters WHERE Character_ID = ?', 
        [relatedID]
      );

      relatedCharacters.push({
        realtion_ID: relatedID,
        realtion_Name: relatedName,
        realtion_Image: characters_img.length > 0 ? characters_img[0].Role_Image : null,
        relation_Type: element.Relation_Type,
      });
    }

    // 返回响应
    res.json({ data: relatedCharacters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships', data: null });
  }
});

module.exports = router;