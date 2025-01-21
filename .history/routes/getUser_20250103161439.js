const { Router } = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'abc123';
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const router = Router();

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const buffer = Buffer.from(file.originalname, 'binary');
    const decodedName = buffer.toString('utf8'); // 将二进制数据转换为 UTF-8 编码
    cb(null, Date.now() + '-' + decodedName);
  }
});

const upload = multer({ storage: storage });

// 获取suo
router.get('/api/user/info', protect, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT User_ID, User_Name, Email, NickName, AvatarUrl FROM user WHERE User_ID = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }

    const user = users[0];
    res.json({ success: true, userInfo: { id: user.User_ID, username: user.User_Name, email: user.Email, nickname: user.NickName, avatarUrl: user.AvatarUrl } });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});


//修改用户信息
router.post('/api/user/change_userinfo', async (req, res) => {
  try {
    const { username, new_nickname,new_email } = req.body;

    if (!username) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 查询用户
    const [users] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ error: '不存在该用户' });
    }
    
    const [result] = await pool.query('UPDATE user set NickName = ? , Email = ? where User_Name=?',[new_nickname,new_email,username]);
    res.json({ message: '用户信息更新成功' });
  }catch{

  }
}
);

// 注册新用户
router.post('/api/user/register', async (req, res) => {
  try {
    const { username, email, password, nickname } = req.body;

    if (!username || !email || !password || !nickname) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE User_Name = ? OR Email = ?', [username, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '用户名或邮箱已经存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const [result] = await pool.query('INSERT INTO user (User_Name, Email, PassWord, NickName) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, nickname]);

    // 创建JWT令牌
    const token = jwt.sign({ userId: result.insertId }, secretKey, { expiresIn: '1h' });

    res.json({ message: '用户注册成功', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '用户注册失败' });
  }
});

// 登录用户
router.post('/api/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' });
    }

    // 查询用户
    const [users] = await pool.query('SELECT * FROM user WHERE User_Name = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ error: '不存在该用户' });
    }

    const user = users[0];

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.PassWord);
    if (!isMatch) {
      return res.status(400).json({ error: '密码错误' });
    }

    // 创建JWT令牌
    const token = jwt.sign({ userId: user.User_ID }, secretKey, { expiresIn: '1h' });

    res.json({ message: '登录成功', token, user: { id: user.User_ID, username: user.User_Name, email: user.Email, nickname: user.NickName } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取用户信息
router.get('/api/user/info', protect, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT User_ID, User_Name, Email, NickName, AvatarUrl FROM user WHERE User_ID = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }

    const user = users[0];
    res.json({ success: true, userInfo: { id: user.User_ID, username: user.User_Name, email: user.Email, nickname: user.NickName, avatarUrl: user.AvatarUrl } });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户头像
router.post('/api/user/avatar', protect, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: '未上传文件' });
    }
    console.log(file)
    const avatarUrl = `http://localhost:3000/uploads/${file.filename}`;

    // 更新用户头像信息
    await pool.query('UPDATE user SET AvatarUrl = ? WHERE User_ID = ?', [avatarUrl, req.user.userId]);

    res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error('Error updating user avatar:', error);
    res.status(500).json({ success: false, message: '更新头像失败' });
  }
});

// 登出
router.post('/api/user/logout', protect, (req, res) => {
  try {
    // 清除客户端的 JWT 令牌
    res.clearCookie('token'); // 如果你使用的是 cookie 存储令牌
    res.json({ message: '登出成功' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: '登出失败' });
  }
});


//修改密码
router.post('/api/user/change_password', protect, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.userId;
    console.log(1)
    if (!old_password || !new_password) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }

    // 查询用户
    const [users] = await pool.query('SELECT * FROM user WHERE User_ID = ?', [userId]);
    if (users.length === 0) {
      return res.status(400).json({ error: '不存在该用户' });
    }

    const user = users[0];
    console.log(user)
    // 验证旧密码
    const isMatch = await bcrypt.compare(old_password, user.PassWord);
    if (!isMatch) {
      return res.status(400).json({ error: '旧密码错误' });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // 更新密码
    await pool.query('UPDATE user SET PassWord = ? WHERE User_ID = ?', [hashedNewPassword, userId]);

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: '修改密码失败' });
  }
});

module.exports = router;