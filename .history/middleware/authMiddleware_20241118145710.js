const jwt = require('jsonwebtoken');
const secretKey = 'abc123';

const protect = async (req, res, next) => {
  try {
    // 从请求头中获取 JWT 令牌
    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: '未提供授权令牌' });
    }

    // 移除 "Bearer " 前缀
    token = token.replace('Bearer ', '');

    // 验证令牌
    const decoded = jwt.verify(token, secretKey);

    // 将用户信息附加到请求对象上
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error protecting route:', error);
    res.status(401).json({ error: '无效的令牌' });
  }
};

module.exports = { protect };