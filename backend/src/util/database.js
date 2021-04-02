const mysql = require('mysql2');
const config = require('../../config/config');

//Lấy đối tượng config kết nối database
const db =  config.database;

//Tạo kết nối đến cở sở dữ liệu
const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    database: db.name,
    password: db.password
});

module.exports = pool.promise();