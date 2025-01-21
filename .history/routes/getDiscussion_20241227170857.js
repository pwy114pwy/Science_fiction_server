const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取讨论区API
router.post('/api/getDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID } = req.body;

    // 查询讨论区信息
    let arr = []
    const [discussion] = await pool.query(
      'SELECT * FROM discussion WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );
    arr = discussion
    for (const element of arr) {
      if (element.Discussion_Parent_ID == 0) {
        element["showReplies"] = 0
        element["child_discuss"] = []
        for (const element1 of arr) {
          if (element1.Discussion_Parent_ID == element.Discussion_ID && element1.Discussion_Parent_ID != 0) {
            element["child_discuss"].push(element1)
          }
        }
      }

    }
    console.log(arr)
    // console.log(discussion)

    res.json(discussion.filter((item) => item.Discussion_Parent_ID == 0));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});
// 新增：添加评论API
router.post('/api/AddDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID, Illustrated_Name, Discussion_User_ID,
       Discussion_User_NickName, Discussion_Parent_ID,
        Discussion_Content, Discussion_Time } = req.body;

    // 添加讨论区信息
    // let arr = []
    const [discussion] = await pool.query(
      'SELECT * FROM discussion WHERE Illustrated_ID = ?',
      [Illustrated_ID]
    );
    arr = discussion
    for (const element of arr) {
      if (element.Discussion_Parent_ID == 0) {
        element["showReplies"] = 0
        element["child_discuss"] = []
        for (const element1 of arr) {
          if (element1.Discussion_Parent_ID == element.Discussion_ID && element1.Discussion_Parent_ID != 0) {
            element["child_discuss"].push(element1)
          }
        }
      }

    }
    console.log(arr)
    // console.log(discussion)

    res.json(discussion.filter((item) => item.Discussion_Parent_ID == 0));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;