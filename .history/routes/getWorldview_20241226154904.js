const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取shijieAPI
router.post('/api/getEvent', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询事件信息
    const [Event] = await pool.query(
      'SELECT * FROM event WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );

    res.json(Event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;