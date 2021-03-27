const mysql = require('mysql2');

//Tạo kết nối đến cở sở dữ liệu
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'app_shop',
    password: '123456'
});

module.exports = pool.promise();