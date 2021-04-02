const db = require("../util/database");
const Admin = require("../models/admin");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  formatDateTimeInsertDB,
} = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "admin";
const objName = "Admin";
const primaryKeyTable = "AdminId";
const propName = "AdminName";
const codePropName = "AdminCode";

//#region API function - service
/**
 * Controller lấy toàn bộ quản lý cửa hàng hoặc lấy theo Id cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getAdmins = (req, res, next) => {
  const shopId = req.query.shopId;

  //tạo câu lệnh sql tương ứng
  let sql = `select * from ${tableName} `;
  //xét trường hợp có thêm tham số lấy theo Id cửa hàng
  if (shopId) {
    sql += `where ${primaryKeyTable} = '${shopId}';`;
  }

  //thực hiện lấy danh sách quản lý cửa hàng
  db.execute(sql)
    .then((result) => {
      if (result && result.length > 0) {
        let admins = [];
        result[0].forEach((item) => {
          const admin = new Admin(
            item.AdminId,
            item.AdminCode,
            item.AdminName,
            item.PhoneNumber,
            item.Email,
            item.Address,
            item.Password,
            item.ChatId,
            item.ShopId
          );
          admins.push(admin);
        });
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = admins)
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
 * Lấy tài khoản quản lý cửa hàng theo id
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getAdminById = async (req, res, next) => {
  const adminId = req.params.adminId;
  //check id có trống không
  if (adminId) {
    try {
      const result = await checkExist(primaryKeyTable, adminId);
      if (result) {
        const admin = new Admin(
          result.AdminId,
          result.AdminCode,
          result.AdminName,
          result.PhoneNumber,
          result.Email,
          result.Address,
          result.Password,
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
            (data = admin)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Cannot found account of admin have id='${adminId}' in the database.`),
            (userMsg = `Không tồn tại tài khoản quản lý cửa hàng có id=${adminId} cần tìm.`),
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
 * Tìm kiếm tài khoản quản lý theo tên hoặc theo mã quản lý(phải đúng mã)
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const searchAccountAdmin = async (req, res, next) => {
  const searchText = req.query.text;

  //check id có trống không
  if (searchText) {
    try {
      //tạo câu lệnh truy vấn
      let sql = "";
      sql = `select * from ${tableName} where ${propName} LIKE '%${searchText}%' union select * from ${tableName} where ${codePropName} = '${searchText}';`;
      //thực hiện lấy danh sách quản lý cửa hàng
      db.execute(sql).then((result) => {
        if (result && result.length > 0) {
          let admins = [];
          result[0].forEach((item) => {
            const admin = new Admin(
              item.AdminId,
              item.AdminCode,
              item.AdminName,
              item.PhoneNumber,
              item.Email,
              item.Address,
              item.Password,
              item.ChatId,
              item.ShopId
            );
            admins.push(admin);
          });
          res.send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = admins)
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
const addNewAccountAdmin = async (req, res, next) => {
  //lấy các giá trị request
  const adminId = Guid.newGuid().toString();
  let adminCode = null;
  const adminName = req.body.adminName;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const address = req.body.address;
  const password = req.body.password;
  const chatId = Guid.newGuid().toString();
  const shopId = req.body.shopId;

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới tài khoản quản lý
  const maxCode = await getMaxCode(objName);
  adminCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    adminId &&
    adminCode &&
    adminName &&
    phoneNumber &&
    email &&
    address &&
    password &&
    chatId &&
    shopId
  ) {
    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (AdminId, AdminCode, AdminName, PhoneNumber, Email, Address, Password, ChatId, ShopId) values ('${adminId}', '${adminCode}', '${adminName}', '${phoneNumber}', '${email}', '${address}', '${password}', '${chatId}', '${shopId}')`
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
 * Cập nhật thông tin tài khoản quản lý cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoAccountAdmin = async (req, res, next) => {
  //lấy các giá trị request
  let adminId = req.params.adminId;
  let adminName = req.body.adminName;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let address = req.body.address;
  let password = req.body.password;

  //check id account admin truyền vào rỗng
  if (adminId) {
    try {
      const existAccountAdmin = await checkExist(primaryKeyTable, adminId);
      //check tồn tại account admin có id tương ứng
      if (existAccountAdmin) {
        adminName =
          adminName === undefined ? existAccountAdmin.AdminName : adminName;
        phoneNumber =
          phoneNumber === undefined
            ? existAccountAdmin.PhoneNumber
            : phoneNumber;
        email = email === undefined ? existAccountAdmin.Email : email;
        address = address === undefined ? existAccountAdmin.Address : address;
        password =
          password === undefined ? existAccountAdmin.Password : password;
        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set AdminName = "${adminName}", PhoneNumber = "${phoneNumber}", Email = "${email}", Address = "${address}", Password = "${password}" where ${primaryKeyTable} = "${adminId}"`
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
            (devMsg = `Cannot found account of admin have id='${adminId}' in the database.`),
            (userMsg = `Không tồn tại tài khoản quản lý cửa hàng có id=${adminId} cần cập nhật.`),
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
 * Xóa tài khoản quản lý cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteAccountAdmin = async (req, res, next) => {
  //lấy các giá trị request
  let adminId = req.params.adminId;

  if (adminId) {
    try {
      const result = await deleteRecord(primaryKeyTable, adminId);
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
  getAdmins,
  getAdminById,
  searchAccountAdmin,
  addNewAccountAdmin,
  updateInfoAccountAdmin,
  deleteAccountAdmin,
};
