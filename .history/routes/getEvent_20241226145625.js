const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取事件API
router.post('/api/getEvent', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询角色信息
    const [characters] = await pool.query(
      'SELECT * FROM characters WHERE Character_ID = ?',
      [Character_ID]
    );

    res.json(arr1);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;