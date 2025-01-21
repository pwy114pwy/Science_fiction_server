const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const { Router } = require('express');
// 创建Express应用

const router = Router();
// 确保上传目录存在
const uploadDir = "C:\\Users\\叶\\Desktop\\科幻小说_后台管理\\science_fiction_management\\static\\books_img"
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置Multer以保存上传的文件到指定目录
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      reu
      // 使用encodeURIComponent对文件名进行编码，或者创建一个安全的文件名
      const safeFileName = encodeURIComponent().replace(/%20/g, "_"); // 将空格替换为下划线
      cb(null, Date.now() + '-' + safeFileName);
  }
});

// 过滤只允许上传JPEG/JPG格式的图片
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg/.jpg format allowed!'), false);
    }
};

// 设置Multer中间件
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 限制文件大小为2MB
    }
});

// 定义图片上传路由
router.post('/api/upload_bookimg', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // 返回文件信息作为响应
    res.json({ 
        message: 'File uploaded successfully',
        file: req.file
    });
}, (error, req, res, next) => {
    // 处理上传错误
    if (error instanceof multer.MulterError) {
        return res.status(400).send(error.message);
    } else if (error) {
        return res.status(500).send(error.message);
    }
});
module.exports = router;