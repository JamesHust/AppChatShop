//file đọc file config.json và cấu hình môi trường phát triển
const _ = require('lodash');
 
// environment variables
process.env.NODE_ENV = 'development';

// khai báo các biến config
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
 
//cấu hình môi trường phát triển chung
global.gConfig = finalConfig;

//export ra bên ngoài
module.exports = global.gConfig;