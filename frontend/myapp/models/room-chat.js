//lớp Tin nhắn chat
class RoomChat {
  constructor(
    roomId, //id phòng chat
    shopId, //Id cửa hàng
    shopName, //Tên cửa hàng
    avatar, //Ảnh đại diện của cửa hàng hay ảnh thương hiệu
    activeStatus, //trạng thái hoạt động
    finalTextMessage //tin nhắn cuối cùng
  ) {
    this.roomId = roomId;
    this.shopId = shopId;
    this.shopName = shopName;
    this.avatar = avatar;
    this.activeStatus = activeStatus;
    this.finalTextMessage = finalTextMessage;
  }
}

export default RoomChat;
