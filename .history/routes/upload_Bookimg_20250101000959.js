const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Router } = require('express');

// 创建Express路由
const router = Router();

// 定义主上传目录和辅助上传目录
const uploadDir = "C:\\Users\\叶\\Desktop\\科幻小说_后台管理\\science_fiction_management\\static\\books_img";
const secondaryUploadDir = "E:\\uniapp工作空间\\Science _fiction\\static\\books_img"; // 替换为你的第二个目录路径

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// console.log(fs.existsSync(secondaryUploadDir))
if (!fs.existsSync(secondaryUploadDir)) {
    fs.mkdirSync(secondaryUploadDir, { recursive: true });
}

// 配置Multer以保存上传的文件到指定目录
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 使用时间戳和原始文件名生成唯一的文件名
        cb(null, file.Buffer.from(req.file.originalname, "latin1").toString(
            "utf8"
        ));
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
// 定义图片上传路由
router.post('/api/upload_bookimg', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file)
        // 直接从 req.file 获取文件名
        const uniqueFileName = Buffer.from(req.file.originalname, "latin1").toString(
            "utf8"
        );
        console.log(uniqueFileName)
        // 构建源文件路径和目标文件路径
        const sourceFilePath = path.join(uploadDir, uniqueFileName);
        const targetFilePath = path.join(secondaryUploadDir, uniqueFileName);

        // 确保文件名不是 undefined
        if (!uniqueFileName) {
            throw new Error("File name is undefined");
        }

        // 复制文件到第二个目录
        await fs.promises.copyFile(sourceFilePath, targetFilePath);

        // 返回文件信息作为响应
        res.json({
            message: 'File uploaded and copied successfully',
            file: req.file,
            savedPaths: [sourceFilePath, targetFilePath]
        });
    } catch (error) {
        next(error);
    }
}, (error, req, res, next) => {
    // 处理上传错误
    if (error instanceof multer.MulterError) {
        return res.status(400).send(error.message);
    } else if (error) {
        console.error(error); // 打印出错信息以便调试
        return res.status(500).send(error.message || 'Internal Server Error');
    }
});

module.exports = router;