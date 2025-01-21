const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const { Router } = require('express');
// 创建Express应用
const app = express();

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'static', 'books_img');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置Multer以保存上传的文件到指定目录
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 使用时间戳和原始文件名生成唯一的文件名
        cb(null, Date.now() + '-' + file.originalname);
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
app.post('/upload', upload.single('file'), (req, res) => {
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

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});