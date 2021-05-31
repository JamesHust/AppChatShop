const db = require("../util/database");
const { Guid } = require("js-guid");
const { getInfoShops } = require("./shops");
const { getRoomById, checkExistRoom, createRoom } = require("./room-chat");
const { convertPathFile, checkExist } = require("../util/common");
const Response = require("../models/response");
const DetailProduct = require("../models/detail-product");
const DetailMessageText = require("../models/detail-message-text");
const DetailMessageImage = require("../models/detail-message-img");
const { result } = require("lodash");

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
  const customerId = req.query.customerId;
  const areaId = req.query.areaId;
  if (customerId && areaId) {
    try {
      // Lấy danh sách các shop hiện tại
      const listShop = await getInfoShops(areaId);
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
  const shopId = req.body.shopId;
  const type = req.body.type; //kiểu nhập tin nhắn
  if (packageMess && actor && roomId && shopId && type) {
    try {
      const roomChat = await getRoomById(roomId);
      // Check có roomchat phù hợp
      if (roomChat) {
        let result = null;
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
          if (actor == "customer") {
            result = await analysisOfText(textMessage, shopId, type);
          }
        }
        //trường hợp gửi tin nhắn là hình ảnh
        if (packageMess.image) {
          imgMessage = packageMess.image;
        }
        //Thực hiện thêm tin nhắn mới
        await db.execute(
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
 * Hàm phân tích tin nhắn
 * @param {*} messageText tin nhắn dạng text
 * @param {*} shopId Id cửa hàng
 * @param {*} type loại nhập tin nhắn: voice, enter
 * @returns
 */
const analysisOfText = async (messageText, shopId, type) => {
  const message = messageText.toUpperCase();
  try {
    let result = null;
    let sql = null;
    let amount = null;
    //TH1: Trường hợp nhập từ bàn phím. Cú pháp đặt: DAT_#SP00001_15
    if (type === "enterKeyboard") {
      // Loại bỏ dấu và khoảng trắng
      const text = message
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");
      const prefixText = text.substring(0, 4);
      // Kiểm tra tiền tố
      if (prefixText === "ĐAT_" || prefixText === "DAT_") {
        const arrText = text.split("_");
        const prefixId = arrText[1].charAt(0);
        if (prefixId === "#") {
          const productCode = arrText[1].substring(1);
          amount = parseInt(arrText[2]) + "";
          sql = `select * from product where ShopId = '${shopId}' and ProductCode = '${productCode}'`;
        } else {
          result = "Sai cú pháp. Cú pháp đúng: DAT_#[mã sản phẩm]_[số lượng]";
        }
      }
    } else {
      //TH2: Trường hợp nhập bằng giọng nói. Cú pháp: ĐẶT [Số lượng] [Đơn vị] [Tên sản phẩm]
      const arrText = message.split(" ");
      const prefix = arrText[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (prefix === "ĐAT" || prefix === "DAT") {
        const amountText = arrText[1];
        // Check trường hợp là chữ "một" và check dư số 0 ở đầu
        if (amountText === "MỘT") {
          amount = "1";
        } else {
          amount = parseInt(arrText[1]) + "";
        }
        const productName = arrText[3] + message.split(arrText[3])[1];
        sql = `select * from product where ShopId = '${shopId}' and ProductName like '%${productName}%'`;
      } else {
        result =
          "Sai cú pháp. Cú pháp đúng: ĐẶT [Số lượng] [Đơn vị] [Tên sản phẩm]";
      }
    }
    // Check câu lệnh sql
    if (sql) {
      const checkExistProduct = await db.execute(sql);
      if (
        checkExistProduct[0] &&
        checkExistProduct[0].length > 0 &&
        amount != "NaN" &&
        +amount > 0
      ) {
        if (checkExistProduct[0].length > 1) {
          const listProd = [];
          checkExistProduct[0].forEach((item) => {
            listProd.push(
              new DetailProduct(
                item.ProductId,
                item.ProductCode,
                item.ProductName,
                item.Description,
                item.Unit,
                convertPathFile(item.ImageUrl),
                item.ImportPrice,
                item.PurchasePrice,
                item.QuantitySold,
                item.Amount,
                item.DateOfImport,
                item.Rating,
                item.Sale,
                item.ShopId,
                "",
                "",
                item.CategoryId,
                "",
                "",
                "",
                amount,
                item.PurchasePrice //mặc định là tiền bán không tính giảm giá
              )
            );
          });
          result = listProd;
        } else {
          result = new DetailProduct(
            checkExistProduct[0][0].ProductId,
            checkExistProduct[0][0].ProductCode,
            checkExistProduct[0][0].ProductName,
            checkExistProduct[0][0].Description,
            checkExistProduct[0][0].Unit,
            convertPathFile(checkExistProduct[0][0].ImageUrl),
            checkExistProduct[0][0].ImportPrice,
            checkExistProduct[0][0].PurchasePrice,
            checkExistProduct[0][0].Amount,
            checkExistProduct[0][0].QuantitySold,
            checkExistProduct[0][0].DateOfImport,
            checkExistProduct[0][0].Rating,
            checkExistProduct[0][0].Sale,
            checkExistProduct[0][0].ShopId,
            "",
            "",
            checkExistProduct[0][0].CategoryId,
            "",
            "",
            "",
            amount,
            checkExistProduct[0][0].PurchasePrice //mặc định là tiền bán không tính giảm giá
          );
        }
      } else {
        result =
          "Sai mã sản phẩm. Vui lòng nhập lại đúng mã sản phẩm theo cú pháp.";
      }
    }
    return result;
  } catch (err) {
    return `Sai cú pháp. Có lỗi xảy ra: ${err}`;
  }
};

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
