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
router.post('/api/Addcharacter', async (req, res) => {
  try {
    const { Character_ID, Illustrated_ID, Illustrated_Name, Role_Name, X_Position, Y_Position, Role_Introduction, Role_Image, Tag, Classic_Quotes, ContributeList, AbilityList } = req.body;
    let Contribute_1 = ContributeList[0]
    let Contribute_2 = ContributeList[1]
    let Contribute_3 = ContributeList[2]
    let Contribute_4 = ContributeList[3]
    let Contribute_5 = ContributeList[4]
    let Contribute_6 = ContributeList[5]

    let Power_Ability = ContributeList[0]
    let Intellect_Ability = ContributeList[1]
    let Decision_Ability = ContributeList[2]
    let Influence_Ability = ContributeList[3]
    let Moral_Ability = ContributeList[4]
    let Will_Ability = ContributeList[5]
    // console.log(req.body)
    if (Character_ID) { // 更新操作
      // 更新角色信息
      await pool.query(
        `UPDATE book SET Illustrated_ID = ?, Illustrated_Name = ?, Role_Name = ?, X_Position = ?, Y_Position = ?,
         Role_Introduction = ?, Role_Image = ? , Tag = ?,Classic_Quotes = ?, WHERE Book_ID = ?,Contribute_1=?,
         Contribute_2=?,Contribute_3=?,Contribute_4=?,Contribute_5=?,Contribute_6=?,Power_Ability=?,
         Intellect_Ability=?,Decision_Ability=?,Influence_Ability=?,Moral_Ability=?,Will_Ability=?`,
        [Book_Name, Tag, Topic, Author, Rating, Book_Introduce, Img_Url, Book_ID]
      );
      return res.json({ success: true, message: '书籍更新成功' });
    } else { // 添加操作
      // 检查书籍是否已存在
      [existingBooks] = await pool.query('SELECT * FROM book WHERE Book_Name = ?', [Book_Name]);
      if (existingBooks.length > 0) {
        return res.status(400).json({ error: '书籍已存在' });
      }
      // 插入新书籍
      await pool.query(
        'INSERT INTO book (Book_Name, Tag, Topic, Author, Rating, Book_Introduce, Img_Url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Book_Name, Tag, Topic, Author, Rating, Book_Introduce, Img_Url]
      );
      return res.json({ success: true, message: '书籍添加成功' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
});
module.exports = router;