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
router.post('/api/addDiscussion', async (req, res) => {
  try {
    let { Illustrated_ID, Illustrated_Name, Discussion_User_ID,
      Discussion_User_NickName, Discussion_Parent_ID,
      Discussion_Content, Discussion_Time } = req.body;

    // 添加讨论区信息
    // let arr = []
    const [result] = await pool.query(
      'INSERT INTO discussion (Discussion_Parent_ID,Illustrated_ID,Illustrated_Name, Discussion_User_ID, Discussion_User_NickName, Discussion_Content,Discussion_Time) VALUES (?,?,?, ?, ?, ?, ?)', [Discussion_Parent_ID, Illustrated_ID, Illustrated_Name, Discussion_User_ID, Discussion_User_NickName, Discussion_Content,Discussion_Time]
    );
    // arr = discussion

    // console.log(arr)
    // console.log(discussion)

    res.json({ message: '用户评论成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});
// 删除评论
router.post('/api/deleteDiscussion', async (req, res) => {
  try {
    const { Illustrated_ID, Discussion_User_ID } = req.body;

    if (!Illustrated_ID || !Discussion_User_ID) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [Comment_User_Name]);
    // 检查评论是否已存在
    const [existingComments] = await pool.query('SELECT * FROM comment WHERE Book_Comment_ID = ?', [Book_Comment_ID]);
    if (existingUsers.length > 0 && existingComments.length > 0) {
      //删除评论
      const [deleteResult] = await pool.query(
        'DELETE FROM comment WHERE Comment_User_Name = ? AND Book_Comment_ID = ?',
        [Comment_User_Name, Book_Comment_ID]
      );
      res.json({ message: '评论删除成功' });
    } else {
      return res.status(400).json({ error: '用户或评论不存在' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '删除评论失败' });
  }
});

module.exports = router;