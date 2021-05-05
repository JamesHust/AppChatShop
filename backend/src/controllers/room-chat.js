const { Guid } = require("js-guid");
const db = require("../util/database");
const RoomChat = require("../models/room-chat");

//khai báo các biến toàn cục dùng chung
const tableName = "room_chat";

//#region Private Funtion
/**
 * Lấy thông tin phòng theo id
 * @param {*} roomId id phòng
 * @returns 
 */
const getRoomById = async (roomId) => {
  let result = null;
  if(roomId){
    const response = await db.execute(`select * from ${tableName} where RoomId = '${roomId}'`);
    if (response[0][0]) {
      result = response[0][0];
    }
  }
  return result;
}

/**
 * Kiểm tra xem đã tồn tại phòng chưa
 * @param {*} customerId Id khách hàng
 * @param {*} serviceId Id dịch vụ
 * @returns
 */
const checkExistRoom = async (customerChatId, serviceChatId) => {
  let result = null;
  if (customerChatId && serviceChatId) {
    const response = await db.execute(
      `select * from ${tableName} where CustomerChatId = '${customerChatId}' and ServiceChatId = '${serviceChatId}'`
    );
    if (response[0][0]) {
      result = response[0][0];
    }
  }
  return result;
};

/**
 * Tạo phòng chat mới
 * @param {*} customerIdChat Id khách hàng
 * @param {*} serviceIdChat Id dịch vụ
 * @returns
 */
const createRoom = async (customerChatId, serviceChatId) => {
  let result = null;
  const roomId = Guid.newGuid().toString();
  if (customerChatId && serviceChatId && roomId) {
    const response = await db.execute(
      `insert into ${tableName} (RoomId, CustomerChatId, ServiceChatId) values ('${roomId}', '${customerChatId}', '${serviceChatId}');`
    );
    result = roomId;
  }
  return result;
};

/**
 * Xóa phòng chat
 * @param {*} customerId Id khách hàng
 * @param {*} serviceId Id dịch vụ
 */
const deleteRoom = async (customerChatId, serviceChatId) => {
  let result = null;
  const roomId = Guid.newGuid().toString();
  if (customerChatId && serviceChatId && roomId) {
    const response = await db.execute(
      `delete from ${tableName} where CustomerChatId = '${customerChatId}' and ServiceChatId = '${serviceChatId}'`
    );
    result = response;
  }
  return result;
};
//#endregion

//export funtion
module.exports = {
  getRoomById,
  checkExistRoom,
  createRoom,
  deleteRoom,
};
