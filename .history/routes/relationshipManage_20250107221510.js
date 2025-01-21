const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.post('/api/getCharacters', async (req, res) => {

  try {
    let { Illustrated_ID } = req.body;
    const [rows] = await pool.query('SELECT * FROM characters WHERE Illustrated_ID = ?', [Illustrated_ID]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});


// 添加或更新角色
router.post('/api/AddCharacter', async (req, res) => {
  try {
    const { Relationship_ID, Illustrated_ID, Illustrated_Name,R  } = req.body;


    if (Character_ID) { // 更新操作
      // 更新角色信息
      await pool.query(
        `UPDATE characters SET Illustrated_ID = ?, Illustrated_Name = ?, Role_Name = ?, X_Position = ?, Y_Position = ?,
         Role_Introduction = ?, Role_Image = ? , Tag = ?,Classic_Quotes = ?,Contribute_1=?,
         Contribute_2=?,Contribute_3=?,Contribute_4=?,Contribute_5=?,Contribute_6=?,Power_Ability=?,
         Intellect_Ability=?,Decision_Ability=?,Influence_Ability=?,Moral_Ability=?,Will_Ability=?
          WHERE Character_ID = ?`,
        [Illustrated_ID, Illustrated_Name, Role_Name, X_Position, Y_Position, Role_Introduction,
          Role_Image, Tag, Classic_Quotes, Contribute_1, Contribute_2, Contribute_3, Contribute_4,
          Contribute_5, Contribute_6, Power_Ability, Intellect_Ability, Decision_Ability,
          Influence_Ability, Moral_Ability, Will_Ability, Character_ID
        ]
      );
      return res.json({ success: true, message: '角色更新成功' });
    } else { // 添加操作
      // 检查角色是否已存在
      let [existingBooks] = await pool.query('SELECT * FROM characters WHERE Role_Name = ?', [Role_Name]);
      if (existingBooks.length > 0) {
        return res.status(400).json({ error: '角色已存在' });
      }
      // 插入新角色
      await pool.query(
        `INSERT INTO characters (Illustrated_ID, Illustrated_Name, Role_Name, X_Position, Y_Position,
         Role_Introduction, Role_Image, Tag,Classic_Quotes,Contribute_1,
         Contribute_2,Contribute_3,Contribute_4,Contribute_5,Contribute_6,Power_Ability,
         Intellect_Ability,Decision_Ability,Influence_Ability,Moral_Ability,Will_Ability) VALUES (?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [Illustrated_ID, Illustrated_Name, Role_Name, X_Position, Y_Position, Role_Introduction,
            Role_Image, Tag, Classic_Quotes, Contribute_1, Contribute_2, Contribute_3, Contribute_4,
            Contribute_5, Contribute_6, Power_Ability, Intellect_Ability, Decision_Ability,
            Influence_Ability, Moral_Ability, Will_Ability, Character_ID
          ]
      );
      return res.json({ success: true, message: '角色添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});

//删除角色
router.post('/api/Delcharacter', async (req, res) => {
  try {
    const { Character_ID } = req.body;
    
    if (!Character_ID) {
      return res.status(400).json({ error: '角色ID是必填的' });
    }

    const [deleteResult] = await pool.query(
      'DELETE FROM characters WHERE Character_ID = ?',
      [Character_ID]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: '角色删除成功' });
    } else {
      return res.status(404).json({ error: '没有找到要删除的角色' });
    }
  } catch (error) {
    console.error('Error deleting browse history:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});
module.exports = router;