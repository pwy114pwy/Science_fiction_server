const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    let { Character_ID } = req.body;

    // 查询角色信息
    const [characters] = await pool.query(
      'SELECT * FROM relationships,characters WHERE From_CharacterID = ? || To_CharacterID = ? join const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    const { Character_ID } = req.body;

    if (!Character_ID) {
      return res.status(400).json({ error: 'Character_ID is required', data: null });
    }

    // 使用JOIN查询角色信息及图片
    const query = `
      SELECT 
        CASE WHEN r.From_CharacterID = ? THEN r.To_CharacterID ELSE r.From_CharacterID END AS realtion_ID,
        CASE WHEN r.From_CharacterID = ? THEN r.To_Name ELSE r.From_Name END AS realtion_Name,
        c.Role_Image AS realtion_Image,
        r.Relation_Type
      FROM relationships r
      JOIN characters c ON 
        (r.From_CharacterID = c.Character_ID OR r.To_CharacterID = c.Character_ID)
      WHERE r.From_CharacterID = ? OR r.To_CharacterID = ?
      AND c.Character_ID != ?
    `;

    const [rows] = await pool.query(query, [
      Character_ID, Character_ID, Character_ID, Character_ID, Character_ID
    ]);

    // 返回响应
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships', data: null });
  }
});

module.exports = router;',
      [Character_ID, Character_ID]
    );
    let arr = []
    for (const element of characters) {
      let obj = {
        realtion_ID: null,
        realtion_Name: "",
        realtion_Image: "",
        relation_Type: element.Relation_Type,
      }
      if (element.From_CharacterID == Character_ID) {
        obj.realtion_ID = element.To_CharacterID;
        obj.realtion_Name = element.To_Name;
      } else {
        obj.realtion_ID = element.From_CharacterID;
        obj.realtion_Name = element.From_Name;
      }

      // console.log(characters_img[0].Role_Image)
      arr.push(obj)


    }
    // for (const element of arr) {
    //   console.log(element.realtion_ID)
    //   const [characters_img] = await pool.query(
    //     'SELECT Role_Image FROM characters WHERE Character_ID = ?',
    //     [element.realtion_ID]
    //   );
    //   element["realtion_Image"] = characters_img[0].Role_Image
    // }
    console.log(arr);



    // 返回响应
    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;