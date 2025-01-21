const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取讨论区API
router.post('/api/getDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询世界观信息
    const [Science] = await pool.query(
      'SELECT * FROM science WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );

    res.json(Science);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;