const db = require("../util/database");
const Shipper = require("../models/shipper");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const fs = require("fs");
const bcrypt = require("bcrypt");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  convertPathFile,
} = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "shipper";
const objName = "Shipper";
const primaryKeyTable = "ShipperId";
const propName = "ShipperName";
const codePropName = "ShipperCode";

//#region API function - service
/**
 * Controller lấy toàn bộ tài khoản shipper hoặc lấy theo Id cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getShippers = (req, res, next) => {
  const shopId = req.query.shopId;

  //tạo câu lệnh sql tương ứng
  let sql = `select * from ${tableName} `;
  //xét trường hợp có thêm tham số lấy theo Id cửa hàng
  if (shopId) {
    sql += `where ShopId = '${shopId}';`;
  }

  //thực hiện lấy danh sách shipper
  db.execute(sql)
    .then((result) => {
      if (result && result.length > 0) {
        let shippers = [];
        result[0].forEach((item) => {
          const shipper = new Shipper(
            item.ShipperId,
            item.ShipperCode,
            item.ShipperName,
            convertPathFile(item.Avatar),
            item.PhoneNumber,
            item.Address,
            item.Email,
            item.Password,
            item.BasicSalary,
            item.Rating,
            item.ChatId,
            item.ShopId
          );
          shippers.push(shipper);
        });
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = shippers)
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
              (userMsg = "Không tồn tại dữ liệu trong cơ sở dữ liệu."),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    })
    .catch((err) => {
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
    });
};

/**
 * Lấy thông tin tài khoản shipper theo id khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getShipperById = async (req, res, next) => {
  const shipperId = req.params.shipperId;
  //check id có trống không
  if (shipperId) {
    try {
      const result = await checkExist(primaryKeyTable, shipperId);
      if (result) {
        const shipper = new Shipper(
          result.ShipperId,
          result.ShipperCode,
          result.ShipperName,
          result.PhoneNumber,
          result.Address,
          result.Email,
          result.Password,
          result.Rating,
          result.ChatId,
          result.ShopId
        );
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = shipper)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Cannot found account of shipper have id='${shipperId}' in the database.`),
            (userMsg = `Không tồn tại tài khoản shipper có id=${shipperId} cần tìm.`),
            (moreInfo = null),
            (data = null)
          )
        );
      }
    } catch (err) {
      res.send(
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
    res.send(
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
 * Tìm kiếm tài khoản shipper theo tên hoặc theo mã shipper(phải đúng mã)
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const searchAccountShipper = async (req, res, next) => {
  const searchText = req.query.text;

  //check id có trống không
  if (searchText) {
    try {
      //tạo câu lệnh truy vấn
      let sql = "";
      sql = `select * from ${tableName} where ${propName} LIKE '%${searchText}%' union select * from ${tableName} where ${codePropName} = '${searchText}';`;
      //thực hiện lấy danh sách shipper
      db.execute(sql).then((result) => {
        if (result && result.length > 0) {
          let shippers = [];
          result[0].forEach((item) => {
            const shipper = new Shipper(
              item.ShipperId,
              item.ShipperCode,
              item.ShipperName,
              item.PhoneNumber,
              item.Address,
              item.Email,
              item.Password,
              item.Rating,
              item.ChatId,
              item.ShopId
            );
            shippers.push(shipper);
          });
          res.send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = shippers)
            )
          );
        } else {
          res.send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Data is empty."),
              (userMsg = `Không tìm thấy kết quả với từ khóa "${searchText}"`),
              (moreInfo = null),
              (data = null)
            )
          );
        }
      });
    } catch (err) {
      res.send(
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
    res.send(
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
 * Thêm tài khoản quản lý mới
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const addNewAccountShipper = async (req, res, next) => {
  const dataReq = JSON.parse(req.body.shipper);
  //lấy các giá trị request
  const shipperId = Guid.newGuid().toString();
  const shipperCode = dataReq.shipperCode;
  const shipperName = dataReq.shipperName;
  const phoneNumber = dataReq.phoneNumber;
  const address = dataReq.address;
  const email = dataReq.email;
  const password = dataReq.password;
  const basicSalary = dataReq.basicSalary;
  const rating = dataReq.rating === undefined ? 0 : dataReq.rating;
  const chatId = Guid.newGuid().toString();
  const shopId = dataReq.shopId;
  const roleAction = dataReq.roleAction;

  // Check quyền
  if (roleAction != 1) {
    return res
      .status(401)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "You are not authorized to perform this action."),
          (userMsg = "Bạn không có quyền thực hiện hành động này."),
          (moreInfo = null),
          (data = null)
        )
      );
  }

  //check tồn tại tài khoản
  const result = await db.execute(
    `select * from shipper where shipperCode = '${shipperCode}' or Email = '${email}' or PhoneNumber = '${phoneNumber}'`
  );
  if (result[0].length > 0) {
    return res
      .status(403)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "You are not authorized to perform this action."),
          (userMsg = "Email hoặc Số điện thoại hoặc Mã CCCD/CMND đã bị trùng."),
          (moreInfo = null),
          (data = null)
        )
      );
  }

  //check request có trường rỗng
  if (
    shipperId &&
    shipperCode &&
    shipperName &&
    phoneNumber &&
    address &&
    email &&
    password &&
    basicSalary &&
    chatId &&
    shopId &&
    req.file
  ) {
    //Mã hóa mật khẩu
    var passEncryption = bcrypt.hashSync(password, 8);
    const avatar = `shippers/${req.nameFileImg}`;

    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (ShipperId, ShipperCode, ShipperName, Avatar, PhoneNumber, Address, Email, Password, BasicSalary, Rating, ChatId, ShopId) values ('${shipperId}', '${shipperCode}', '${shipperName}', '${avatar}', '${phoneNumber}', '${address}', '${email}', '${passEncryption}', '${basicSalary}', ${rating}, '${chatId}', '${shopId}')`
    )
      .then((result) => {
        return res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = result)
            )
          );
      })
      .catch((err) => {
        res
          .status(500)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = "DB004"),
              (devMsg = err.toString()),
              (userMsg = "Lỗi không thêm mới được dữ liệu"),
              (moreInfo = null),
              (data = null)
            )
          );
      });
  } else {
    res
      .status(400)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "Params in request is null."),
          (userMsg = "Dữ liệu truyền sang đang để trống."),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Cập nhật thông tin tài khoản shipper
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoAccountShipper = async (req, res, next) => {
  const dataReq = JSON.parse(req.body.shipper);
  //lấy các giá trị request
  let shipperId = dataReq.shipperId;
  let shipperName = dataReq.shipperName;
  let address = dataReq.address;
  let basicSalary = dataReq.basicSalary;
  let rating = dataReq.rating;

  //check id shipper truyền vào rỗng
  if (shipperId) {
    try {
      const existAccountShipper = await checkExist(primaryKeyTable, shipperId);

      //check tồn tại account admin có id tương ứng
      if (existAccountShipper) {
        // Lấy đường dẫn cho ảnh
        if (req.file) {
          avatar = `shippers/${req.nameFileImg}`;
          // thực hiện xóa file cũ
          const pathImg = `./public/${existAccountShipper.Avatar}`;
          if (existAccountShipper.Avatar) {
            fs.unlinkSync(pathImg);
          }
        } else {
          avatar = existAccountShipper.Avatar;
        }

        shipperName = shipperName
          ? shipperName
          : existAccountShipper.ShipperName;
        address = address ? address : existAccountShipper.Address;
        basicSalary = basicSalary
          ? basicSalary
          : existAccountShipper.BasicSalary;
        rating = rating ? rating : existAccountShipper.Rating;
        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set ShipperName = "${shipperName}", Address = "${address}", BasicSalary = "${basicSalary}", Rating = ${rating}, Avatar = '${avatar}' where ${primaryKeyTable} = "${shipperId}"`
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
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
              (errorCode = ""),
              (devMsg = `Cannot found account of shipper have id='${shipperId}' in the database.`),
              (userMsg = `Không tồn tại tài khoản shipper có id=${shipperId} cần cập nhật.`),
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
            (errorCode = "DB002"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không cập nhật được dữ liệu"),
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
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "Params in request is null."),
          (userMsg = "Dữ liệu truyền sang đang để trống."),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Xóa tài khoản shipper
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteAccountShipper = async (req, res, next) => {
  //lấy các giá trị request
  const shipperId = req.body.shipperId;
  const roleAction = req.body.roleAction;

  // Check quyền
  if (roleAction != 1) {
    return res
      .status(401)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "You are not authorized to perform this action."),
          (userMsg = "Bạn không có quyền thực hiện hành động này."),
          (moreInfo = null),
          (data = null)
        )
      );
  }

  if (shipperId) {
    try {
      const existAccountShipper = await checkExist(primaryKeyTable, shipperId);
      if (existAccountShipper) {
        // thực hiện xóa file ảnh cũ
        const pathImg = `./public/${existAccountShipper.Avatar}`;
        if (existAccountShipper.Avatar) {
          fs.unlinkSync(pathImg);
        }
        // Xóa trong CSDL
        const result = await deleteRecord(primaryKeyTable, shipperId);
        return res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
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
              (errorCode = ""),
              (devMsg = `Cannot found account of shipper have id='${shipperId}' in the database.`),
              (userMsg = `Không tồn tại tài khoản shipper có id=${shipperId} cần cập nhật.`),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      return res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB003"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không xóa được dữ liệu"),
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
          (isSuccess = false),
          (errorCode = ""),
          (devMsg = "Params in request is null."),
          (userMsg = "Dữ liệu truyền sang đang để trống."),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};
//#endregion

//#region Private Function
/**
 * Lấy thông tin shipper theo email hoặc số điện thoại
 * @param {*} userName tên đăng nhập
 */
const getShipperByEmailOrPhone = async (userName) => {
  let result = null;
  const sql = `select * from ${tableName} where PhoneNumber = "${userName}" OR Email = "${userName}";`;
  const shipper = await db.execute(sql);
  if (shipper) {
    result = new Shipper(
      shipper[0][0].ShipperId,
      shipper[0][0].ShipperCode,
      shipper[0][0].ShipperName,
      convertPathFile(shipper[0][0].Avatar),
      shipper[0][0].PhoneNumber,
      shipper[0][0].Address,
      shipper[0][0].Email,
      shipper[0][0].Password,
      shipper[0][0].BasicSalary,
      shipper[0][0].Rating,
      shipper[0][0].ChatId,
      shipper[0][0].ShopId
    );
  }
  return result;
};
//#endregion

//export controller
module.exports = {
  getShippers,
  getShipperById,
  searchAccountShipper,
  addNewAccountShipper,
  updateInfoAccountShipper,
  deleteAccountShipper,
  getShipperByEmailOrPhone,
};
