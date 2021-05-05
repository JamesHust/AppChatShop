const db = require("../util/database");
const { Guid } = require("js-guid");
const { getInfoShops } = require("./shops");
const { getRoomById, checkExistRoom, createRoom } = require("./room-chat");
const { convertPathFile, formatDateTimeInsertDB } = require("../util/common");
const Response = require("../models/response");
const DetailMessageText = require("../models/detail-message-text");
const DetailMessageImage = require("../models/detail-message-img");

//khai báo các biến toàn cục dùng chung
const tableName = "message";
const objName = "Message";
const primaryKeyTable = "ChatId";

//#region API function - service

/**
 * Hàm lấy tất cả bảng chat cho từng khách hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getBoardChat = async (req, res, next) => {
  const customerId = req.params.customerId;
  if (customerId) {
    try {
      // Lấy danh sách các shop hiện tại
      const listShop = await getInfoShops();
      if (listShop && listShop.length > 0) {
        const result = [];
        await Promise.all(
          listShop.map(async (shop) => {
            const shopId = shop.ShopId;
            const shopName = shop.ShopName;
            const avatar = convertPathFile(shop.Avatar);
            const activeStatus = "Đang hoạt động"; //tạm thời đang fix
            let finalTextMessage = null;
            let status = 2;
            let roomId = null;
            // Lấy chatId tương ứng với từng đối tượng
            const shopChatId = await getChatId(shopId, "shop");
            const customerChatId = await getChatId(customerId, "customer");
            const existRoom = await checkExistRoom(customerChatId, shopChatId);
            // Check xem đã có phòng chat chưa
            if (existRoom) {
              roomId = existRoom.RoomId;
              // Lấy message gần đây nhất của phòng chat
              const lastMessage = await getLastMessage(roomId);
              if (lastMessage) {
                // Trường hợp nếu là tin nhắn text
                if (
                  lastMessage.TextMessage &&
                  lastMessage.TextMessage != "null"
                ) {
                  if (lastMessage.SenderId === customerChatId) {
                    finalTextMessage = `Bạn: ${lastMessage.TextMessage}`;
                  } else {
                    finalTextMessage = lastMessage.TextMessage;
                  }
                }
                // Trường hợp nếu là tin nhắn hình ảnh
                if (
                  lastMessage.ImgMessage &&
                  lastMessage.ImgMessage != "null"
                ) {
                  if (lastMessage.SenderId === customerChatId) {
                    finalTextMessage = "Bạn vừa gửi 1 hình ảnh 🌄";
                  } else {
                    finalTextMessage = `${shopName} vừa gửi 1 hình ảnh 🌄`;
                  }
                }
                status = lastMessage.Status;
              } else {
                finalTextMessage = "Nhập tin nhắn đặt hàng ngay nào 😍";
              }
            } else {
              roomId = await createRoom(customerChatId, shopChatId);
              finalTextMessage = "Nhập tin nhắn đặt hàng ngay nào 😍";
            }

            result.push({
              shopId: shopId,
              shopName: shopName,
              avatar: avatar,
              activeStatus: activeStatus,
              finalTextMessage: finalTextMessage,
              status: status,
              roomId: roomId,
            });
          })
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = result)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = null),
              (devMsg = "Not found any shop in database"),
              (userMsg =
                "Không tìm thấy bất kỳ cửa hàng nào trong cở sở dữ liệu."),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB001"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(400)
      .send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Hàm lấy danh sách tin nhắn theo từng phòng chat
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getListMessage = async (req, res, next) => {
  const roomId = req.params.roomId;
  if (roomId) {
    try {
      const response = await db.execute(
        `select * from ${tableName} where RoomId = '${roomId}' order by CreatedDate desc;`
      );
      if (response[0] && response[0].length > 0) {
        let listMess = [];
        for (var mess of response[0]) {
          const infoUser = await getInfoReceiver(mess.SenderId);
          // Xét trường hợp tin nhắn gửi là text
          if (mess.TextMessage) {
            const message = new DetailMessageText(
              mess.MesageId,
              mess.TextMessage,
              mess.CreatedDate,
              infoUser._id,
              infoUser.name,
              infoUser.avatar
            );
            listMess.push(message);
          } else {
            const message = new DetailMessageImage(
              mess.MesageId,
              mess.ImgMessage,
              mess.CreatedDate,
              infoUser._id,
              infoUser.name,
              infoUser.avatar
            );
            listMess.push(message);
          }
        }
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = listMess)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Data is empty."),
              (userMsg = null),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB001"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(400)
      .send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Thêm tin nhắn vừa gửi vào cơ sở dữ liệu
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const addNewMessage = async (req, res, next) => {
  const packageMess = req.body.packageMess;
  const actor = req.body.actor;
  const roomId = req.body.roomId;
  if (packageMess && actor && roomId) {
    try {
      const roomChat = await getRoomById(roomId);
      // Check có roomchat phù hợp
      if (roomChat) {
        const messageId = packageMess._id;
        let senderId = null;
        let recipientId = null;
        let textMessage = null;
        let imgMessage = null;
        let status = 2;
        // Check trường hợp là khách hàng hay dịch vụ gửi tin nhắn
        if (actor == "customer") {
          senderId = roomChat.CustomerChatId;
          recipientId = roomChat.ServiceChatId;
          status = 1;
        } else {
          senderId = roomChat.ServiceChatId;
          recipientId = roomChat.CustomerChatId;
        }
        //trường hợp gửi tin nhắn là text
        if (packageMess.text) {
          textMessage = packageMess.text;
        }
        //trường hợp gửi tin nhắn là hình ảnh
        if (packageMess.image) {
          imgMessage = packageMess.image;
        }
        //Thực hiện thêm tin nhắn mới
        const result = db.execute(
          `insert into ${tableName} (MesageId, SenderId, RecipientId, TextMessage, ImgMessage, RoomId, Status) values ('${messageId}', '${senderId}', '${recipientId}', '${textMessage}', '${imgMessage}', '${roomId}', ${status})`
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = result)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = null),
              (devMsg = `Not found room chat with id = ${roomId}.`),
              (userMsg = null),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB004"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi thêm mới dữ liệu vào cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(400)
      .send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};
//#region

//#region Private Function
/**
 * Hàm lấy tin nhắn cuối cùng theo roomId
 * @param {*} roomId Id phòng chat
 * @returns
 */
const getLastMessage = async (roomId) => {
  let result = null;
  if (roomId) {
    const response = await db.execute(
      `select * from ${tableName} where RoomId = '${roomId}' order by CreatedDate desc limit 1;`
    );
    if (response[0][0]) {
      result = response[0][0];
    }
  }
  return result;
};

/**
 * Lấy thông tin người nhận
 * @param {*} id id shop hoặc id khách hàng
 * @returns
 */
const getInfoReceiver = async (id) => {
  let _id = null;
  let name = null;
  let avatar = null;
  if (id) {
    const customer = await db.execute(
      `select * from customer where ChatId = '${id}'`
    );
    if (customer[0][0]) {
      _id = 1;
      name = customer[0][0].CustomerName;
      avatar = convertPathFile(customer[0][0].Avatar);
    } else {
      const shop = await db.execute(
        `select * from shop where ChatId = '${id}'`
      );
      if (shop[0][0]) {
        _id = shop[0][0].ShopId;
        name = shop[0][0].ShopName;
        avatar = convertPathFile(shop[0][0].Avatar);
      }
    }
  }
  return {
    _id: _id,
    name: name,
    avatar: avatar,
  };
};

/**
 * Lâý ChatId tương ứng với id - khóa chính định danh khách hàng hoặc dịch vụ, cửa hàng
 * @param {*} id - khóa chính
 * @param {*} object - đối tượng cần lấy id
 * @returns
 */
const getChatId = async (id, nameObject) => {
  let result = null;
  let res = null;
  if (nameObject === "shop") {
    res = await db.execute(`select ChatId from shop where ShopId = '${id}'`);
  }
  if (nameObject === "customer") {
    res = await db.execute(
      `select ChatId from customer where CustomerId = '${id}'`
    );
  }
  if (res[0][0]) {
    result = res[0][0].ChatId;
  }
  return result;
};
//#region

//export controller
module.exports = {
  getBoardChat,
  getListMessage,
  addNewMessage,
};
