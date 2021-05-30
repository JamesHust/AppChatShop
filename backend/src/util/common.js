const db = require("./database");

//Khai báo cấu hình, khai báo phải theo thứ tự, nhận môi trường theo cấu hình
process.env.NODE_ENV = "development";
const config = require("../../config/config");

/**
 * Hàm tạo mã code mới
 * @param {*} maxOldCode id cũ
 * @returns mã code mới
 */
const generateNewCode = (maxOldCode) => {
  //kiểm tra có id truyền vào có null không
  if (maxOldCode) {
    const prefixCode = maxOldCode.slice(0, 2);
    let newNumber = +maxOldCode.slice(2) + 1;
    const lengthOldNum = maxOldCode.length - 2;
    const lengthNewNum = newNumber.toString().length;
    //xét trường hợp số đã max
    if (lengthOldNum < newNumber.toString().length) {
      return prefixCode + newNumber;
    } else {
      const lengthNumzero = lengthOldNum - lengthNewNum;
      for (i = 0; i < lengthNumzero; i++) {
        newNumber = "0" + newNumber.toString();
      }
      return prefixCode + newNumber;
    }
  }
};

/**
 * Hàm lấy giá trị mã lớn nhất bảng trong cơ sở dữ liệu
 * @param {*} className tên của lớp tương ứng với bảng trong CSDL.VD: className là Category - bảng category
 * @returns Mã lớn nhất có trong bảng
 */
const getMaxCode = async (className) => {
  const tableName = className.toLowerCase();
  const codeName = className + "Code";
  const result = await db.execute(
    `select ${codeName} from \`${tableName}\` order by ${codeName} desc limit 1;`
  );
  if (result[0].length > 0) {
    return (maxId = result[0][0][codeName]);
  } else return null;
};

/**
 * Hàm check và lấy giá trị theo khóa chính - Id
 * @param {*} primaryKeyName Tên khóa chính
 * @param {*} valueKey Giá trị khóa
 * @returns Bản ghi có chứa khóa chính trùng
 */
const checkExist = async (primaryKeyName, valueKey) => {
  let result = null;
  const tableName = primaryKeyName.slice(0, -2).toLowerCase();
  const response = await db.execute(
    `select * from \`${tableName}\` where ${primaryKeyName} = "${valueKey}"`
  );
  if (response[0][0]) {
    result = response[0][0];
  }
  return result;
};

/**
 * Hàm xóa bản ghi theo khóa chính - Id
 * @param {*} primaryKeyName Tên khóa chính
 * @param {*} valueKey Giá trị khóa
 * @returns Bản ghi có chứa khóa chính trùng
 */
const deleteRecord = async (primaryKeyName, valueKey) => {
  const tableName = primaryKeyName.slice(0, -2).toLowerCase();
  const result = await db.execute(
    `delete from ${tableName} where ${primaryKeyName} = "${valueKey}"`
  );
  return result;
};

/**
 * Chuyển format datetime thành kiểu có thể insert được database
 * chuyển từ dạng text
 * @param {*} dateTime Dữ liệu ngày tháng truy xuất từ database. VD: 2021-03-28T17:00:00.000Z => 2021-03-28 00:00:00
 */
const formatDateTimeInsertDB = (dateTime) => {
  if (dateTime) {
    const date = dateTime.split("T")[0];
    const time = dateTime.split("T")[1].split(".")[0];
    return `${date} ${time}`;
  } else return null;
};

/**
 * Chuyển format datetime thành kiểu có thể insert được database
 * chuyển từ dạng Date()
 * @param {*} dateTime
 * @returns
 */
const formatTimeToInsertDB = (dateTime) => {
  var dateString =
    dateTime.getFullYear() +
    "-" +
    ("0" + (dateTime.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + dateTime.getDate()).slice(-2) +
    " " +
    ("0" + dateTime.getHours()).slice(-2) +
    ":" +
    ("0" + dateTime.getMinutes()).slice(-2) +
    ":" +
    ("0" + dateTime.getSeconds()).slice(-2);
  return dateString;
};

/**
 * Hàm chuyển sang http tương ứng truy xuất tới file ở mục public
 * @param {*} path
 */
const convertPathFile = (path) => {
  return `http://${config.node_ip}:${config.node_port}/public/${path}`;
};

module.exports = {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  formatDateTimeInsertDB,
  formatTimeToInsertDB,
  convertPathFile,
};
