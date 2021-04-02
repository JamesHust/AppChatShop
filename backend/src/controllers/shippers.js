const db = require("../util/database");
const Shipper = require("../models/shipper");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
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
    sql += `where ${primaryKeyTable} = '${shopId}';`;
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
            (userMsg = "Không tồn tại dữ liệu trong cơ sở dữ liệu."),
            (moreInfo = null),
            (data = null)
          )
        );
      }
    })
    .catch((err) => {
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
  //lấy các giá trị request
  const shipperId = Guid.newGuid().toString();
  let shipperCode = null;
  const shipperName = req.body.shipperName;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const rating = req.body.rating === undefined ? 0 : req.body.rating;
  const chatId = Guid.newGuid().toString();
  const shopId = req.body.shopId;

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới tài khoản shipper
  const maxCode = await getMaxCode(objName);
  shipperCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    shipperId &&
    shipperCode &&
    shipperName &&
    phoneNumber &&
    address &&
    email &&
    password &&
    chatId &&
    shopId
  ) {
    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (ShipperId, ShipperCode, ShipperName, PhoneNumber, Address, Email, Password, Rating, ChatId, ShopId) values ('${shipperId}', '${shipperCode}', '${shipperName}', '${phoneNumber}', '${address}', '${email}', '${password}', ${rating}, '${chatId}', '${shopId}')`
    )
      .then((result) => {
        res.send(
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
        res.send(
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
    res.send(
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
  //lấy các giá trị request
  let shipperId = req.params.shipperId;
  let shipperName = req.body.shipperName;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let address = req.body.address;
  let password = req.body.password;
  let rating = req.body.rating;

  //check id shipper truyền vào rỗng
  if (shipperId) {
    try {
      const existAccountShipper = await checkExist(primaryKeyTable, shipperId);
      //check tồn tại account admin có id tương ứng
      if (existAccountShipper) {
        shipperName =
          shipperName === undefined
            ? existAccountShipper.ShipperName
            : shipperName;
        phoneNumber =
          phoneNumber === undefined
            ? existAccountShipper.PhoneNumber
            : phoneNumber;
        email = email === undefined ? existAccountShipper.Email : email;
        address = address === undefined ? existAccountShipper.Address : address;
        password =
          password === undefined ? existAccountShipper.Password : password;
        rating = rating === undefined ? existAccountShipper.Rating : rating;
        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set ShipperName = "${shipperName}", PhoneNumber = "${phoneNumber}", Address = "${address}", Email = "${email}", Password = "${password}", Rating = ${rating} where ${primaryKeyTable} = "${shipperId}"`
        );
        res.send(
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
        res.send(
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
      res.send(
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
    res.send(
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
  let shipperId = req.params.shipperId;

  if (shipperId) {
    try {
      const result = await deleteRecord(primaryKeyTable, shipperId);
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = ""),
          (devMsg = ""),
          (userMsg = ""),
          (moreInfo = null),
          (data = result)
        )
      );
    } catch (err) {
      res.send(
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
    res.send(
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
//#endregion

//export controller
module.exports = {
  getShippers,
  getShipperById,
  searchAccountShipper,
  addNewAccountShipper,
  updateInfoAccountShipper,
  deleteAccountShipper,
};
