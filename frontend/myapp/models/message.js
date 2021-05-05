//lớp Tin nhắn chat
class Message {
  constructor(
    messageId, //khóa chính
    senderId, //id người gửi
    recipientId, //id người nhận
    textMessage, //tin nhắn văn bản
    imgMessage, //tin nhắn hình ảnh
    chatTime, //thời gian tạo tin nhắn
    createdDate, //Thời gian khởi tạo tin nhắn
    roomId, //Id phòng chat
  ) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.textMessage = textMessage;
    this.imgMessage = imgMessage;
    this.chatTime = chatTime;
    this.createdDate = createdDate;
    this.roomId = roomId;
  }
};

export default Message;
