const db = require("../util/database");
const {formatDateTimeInsertDB} = require('../util/common');
const { Guid } = require("js-guid");

//khai báo các biến toàn cục dùng chung
const tableName = "token";

//#region Private Funtion
/**
 * Thêm mới token khi login
 * @param {*} accountId id tài khoản
 * @param {*} token
 * @param {*} refreshToken
 * @returns
 */
const createTokenDB = async (accountId, token, refreshToken) => {
  let result = null;
  if (accountId && token && refreshToken) {
    const tokentId = Guid.newGuid().toString();
    const createDate = formatDateTimeInsertDB(new Date().toISOString());
    const modifyDate = formatDateTimeInsertDB(new Date().toISOString());
    const sql = `insert into \`${tableName}\` (Id, AccountId, Token, RefreshToken, CreateDate, ModifyDate) values ('${tokentId}', '${accountId}', '${token}', '${refreshToken}', '${createDate}', '${modifyDate}')`;
    result = await db.execute(sql);
  }
  return result;
};

/**
 * Lấy thông tin token
 * @param {} token
 * @returns
 */
const getToken = async (token) => {
  let result = null;
  if (token) {
    const sql = `select * from ${tableName} where Token = '${token}';`;
    const rs = await db.execute(sql);
    result = rs[0][0];
  }
  return result;
};

/**
 * Tạo token mới khi refreshToken vẫn còn hiệu lực
 * @param {} token
 * @returns
 */
const updateToken = async (refreshToken) => {
  let result = null;
  const modifyDate = new Date().toISOString().slice(0, 10);
  if (tokenId && token && modifyDate) {
    const sql = `update ${tableName} set Token = '${token}', ModifyDate = '${modifyDate}' where RefreshToken = '${refreshToken}'`;
    result = await db.execute(sql);
  }
  return result;
};

/**
 * Xóa token
 * @param {*} refreshToken
 * @returns
 */
const deleteToken = async (refreshToken) => {
  let result = null;
  if (refreshToken) {
    const sql = `delete from ${tableName} where RefreshToken = '${refreshToken}';`;
    result = await db.execute(sql);
  }
  return result;
};
//#endregion

//export funtion
module.exports = {
  getToken,
  createTokenDB,
  deleteToken,
  updateToken
};
