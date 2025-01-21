const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取角色详情API
router.post('/api/getCharacterDetail', async (req, res) => {
  try {
    let { Character_ID } = req.body;

    // 查询所有角色及其固定位置
    const [characters] = await pool.query(
      'SELECT  FROM characters WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );

    // 返回响应
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;