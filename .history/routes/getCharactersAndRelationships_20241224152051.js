const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取所有角色和他们之间的关系的API
router.post('/api/getCharactersAndRelationships', async (req, res) => {
  
  try {
    let {Illustrated_ID}=req.body
    // 查询所有角色
    const [characters] = await pool.query(
      'SELECT CharacterID, Name, NovelID FROM Characters'
    );

    // 查询所有关系
    const [relationships] = await pool.query(
      'SELECT FromCharacterID, ToCharacterID, RelationType FROM Relationships'
    );

    // 将数据转换为适合前端使用的格式
    const formattedCharacters = characters.map((character) => ({
      id: character.CharacterID,
      name: character.Name,
      novelId: character.NovelID,
      x: Math.random() * 700 + 50, // 随机生成X坐标
      y: Math.random() * 600 + 50  // 随机生成Y坐标
    }));

    const formattedRelationships = relationships.map((relation) => ({
      from: relation.FromCharacterID - 1, // ECharts索引从0开始
      to: relation.ToCharacterID - 1,
      label: relation.RelationType
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