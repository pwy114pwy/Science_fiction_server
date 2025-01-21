const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    let { Character_ID } = req.body;

    // 查询角色之间的关系
    const [characters] = await pool.query(
      'SELECT * FROM relationships WHERE From_CharacterID = ? OR To_CharacterID = ?',
      [Character_ID, Character_ID]
    );
    let arr = []
    
    // 组装角色关系数据
    for (const element of characters) {
      let obj = {
        relation_ID: null,
        relation_Name: "",
        relation_Image: "",
        relation_Type: element.Relation_Type,
      }

      // 判断角色关系方向
      if (element.From_CharacterID == Character_ID) {
        obj.relation_ID = element.To_CharacterID;
        obj.relation_Name = element.To_Name;
      } else {
        obj.relation_ID = element.From_CharacterID;
        obj.relation_Name = element.From_Name;
      }

      arr.push(obj);
    }

    // 提取所有角色ID进行批量查询
    const characterIDs = arr.map(item => item.relation_ID);
    if (characterIDs.length > 0) {
      const [charactersImg] = await pool.query(
        'SELECT Character_ID, Role_Image FROM characters WHERE Character_ID IN (?)',
        [characterIDs]
      );

      // 将角色图片信息与角色数据进行合并
      arr = arr.map(item => {
        const characterImg = charactersImg.find(img => img.Character_ID === item.relation_ID);
        item.relation_Image = characterImg ? characterImg.Role_Image || 'default_image_path.jpg' : 'default_image_path.jpg'; // 使用默认图片路径
        return item;
      });
    }

    // 返回响应
    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;
