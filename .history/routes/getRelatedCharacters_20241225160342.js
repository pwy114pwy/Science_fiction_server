const { Router } = require('express');
const pool = require('../db'); // 假设这是您的数据库连接池模块

const router = Router();

// 新增：获取相关角色API
router.post('/api/getRelatedCharacters', async (req, res) => {
  try {
    let { Character_ID } = req.body;

    // 查询角色信息
    const [characters] = await pool.query(
      'SELECT * FROM relationships WHERE From_CharacterID = ? || To_CharacterID = ?',
      [Character_ID,Character_ID]
    );
    let arr=[]
    for (const element of characters) {
      let obj={
        realtion_ID:null,
        realtion_Name:"",
        relation_Type:element.Relation_Type
      }
      if(element.From_CharacterID==Character_ID){
        obj.realtion_ID=element.To_CharacterID;
        obj.realtion_Name=element.To_Name;
      }else{
        obj.realtion_ID=element.From_CharacterID;
        obj.realtion_Name=element.From_Name;
      }
      const [characters_img] = await pool.query(
        'SELECT Role FROM characters WHERE From_CharacterID = ? || To_CharacterID = ?',
        [Character_ID,Character_ID]
      );
      arr.push(obj)
     

    }
    console.log(arr);

    

        // 返回响应
    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching characters and relationships' });
  }
});

module.exports = router;