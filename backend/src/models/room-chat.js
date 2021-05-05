//lớp Tin nhắn chat
module.exports = class RoomChat {
  constructor(
    roomId, //Id phòng chat
    customerId, //id khách hàng
    serviceId, //id dịch vụ
  ) {
    this.roomId = roomId;
    this.customerId = customerId;
    this.serviceId = serviceId;
  }
};
