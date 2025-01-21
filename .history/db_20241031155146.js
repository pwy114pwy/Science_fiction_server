const mysql = require('mysql2/promise');

const connectionConfig = {
  host: '127.0.0.1',
  user: 'root',
  port: "13306",
  password: 'abc123',
  database: 'science_fiction'
};

module.exports = mysql.createPool(connectionConfig);