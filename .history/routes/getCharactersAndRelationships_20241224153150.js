const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取所有角色和他们之间的关系的API
router.post('/api/getCharactersAndRelationships', async (req, res) => {

  try {
    let { Illustrated_ID } = req.body
    // 查询所有角色
    const [characters] = await pool.query(
      'SELECT * CharacterID, Role_Name, Illustrated_ID FROM characters WHERE Illustrated_ID = ?',[Illustrated_ID]
    );

    // 查询所有关系
    const [relationships] = await pool.query(
      'SELECT * From_CharacterID, To_CharacterID, RelationType FROM relationships WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );

    // 将数据转换为适合前端使用的格式
    const formattedCharacters = characters.map((character) => ({
      id: character.Character_ID,
      name: character.Role_Name,
      novelId: character.Illustrated_ID,
      x: Math.random() * 700 + 50, // 随机生成X坐标
      y: Math.random() * 600 + 50  // 随机生成Y坐标
    }));

    const formattedRelationships = relationships.map((relation) => ({
      from: relation.From_CharacterID - 1, // ECharts索引从0开始
      to: relation.To_CharacterID - 1,
      label: relation.Relation_Type
    }));

    // 返回响应
    res.json({
      characters: formattedCharacters,
      relationships: formattedRelationships
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;