const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取讨论区API
router.post('/api/getDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询讨论区信息
    const [discussion] = await pool.query(
      'SELECT * FROM discussion WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );
    for (const element of discussion) {
      if(element.Discussion_Parent_ID!=0){
        const [child_discussion] = await pool.query(
          'SELECT * FROM discussion WHERE Illustrated_ID = ?',
          [Discussion_Parent_ID]
        );
      }
    }
    console.log(discussion)

    res.json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;