const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取讨论区API
router.post('/api/getDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询讨论区信息
    let arr=[]
    const [discussion] = await pool.query(
      'SELECT * FROM discussion WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );
    arr=discussion
    for (const element of arr) {
      if(element.Discussion_Parent_ID==0){
        for (const element1 of object) {
          if(element1.Discussion_Parent_ID==el&&element1.Discussion_Parent_ID!=0){

          }
        }
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