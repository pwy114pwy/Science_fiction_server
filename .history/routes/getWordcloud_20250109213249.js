const { Router } = require('express');
const pool = require('../db');
const router = Router();
const express = require('express');
const path = require('path');
router.get('/api/getWordcloud',(req, res) => {
  const jsonFilePath = path.join('C:\Users\叶\Desktop\科幻小说图鉴服务器\word_freq.json');
  
  // 发送JSON文件作为响应
  res.sendFile(jsonFilePath);
});

module.exports = router;