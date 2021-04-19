//lớp Tin nhắn chat
class Message {
  constructor(
    chatId, //id chat
    textMessage, //tin nhắn văn bản
    voiceMessage, //tin nhắn âm thanh
    imgMessage, //tin nhắn hình ảnh
    chatTime //thời gian tạo tin nhắn
  ) {
    this.chatId = chatId;
    this.textMessage = textMessage;
    this.voiceMessage = voiceMessage;
    this.imgMessage = imgMessage;
    this.chatTime = chatTime;
  }
}

export default Message;
