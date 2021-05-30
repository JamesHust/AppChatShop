const db = require("../util/database");
const Admin = require("../models/admin");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const bcrypt = require("bcrypt");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  formatDateTimeInsertDB,
  convertPathFile,
} = require("../util/common");
const fs = require("fs");

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
 * Hàm lấy danh sách nhân viên theo cửa hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getEmployees = (req, res, next) => {
  const shopId = req.query.shopId;

  //tạo câu lệnh sql tương ứng
  let sql = `select * from ${tableName} where Role=2 `;
  //xét trường hợp có thêm tham số lấy theo Id cửa hàng
  if (shopId) {
    sql += `and ShopId = '${shopId}';`;
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
            item.IDCardCode,
            item.AdminName,
            item.Role,
            item.Gender,
            convertPathFile(item.Avatar),
            item.Birthday,
            item.HomeTown,
            item.PhoneNumber,
            item.Email,
            item.BasicSalary,
            item.Address,
            item.Password,
            item.ChatId,
            item.ShopId
          );
          admins.push(admin);
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
              (data = admins)
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
          result.IDCardCode,
          result.AdminName,
          result.Role,
          result.Gender,
          convertPathFile(result.Avatar),
          result.Birthday,
          result.HomeTown,
          result.PhoneNumber,
          result.Email,
          result.BasicSalary,
          result.Address,
          result.Password,
          result.ChatId,
          result.ShopId
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
              (data = admin)
            )
          );
      } else {
        res
          .status(404)
          .send(
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
  const dataReq = JSON.parse(req.body.admin);
  //lấy các giá trị request
  const adminId = Guid.newGuid().toString();
  let adminCode = null;
  const iDCardCode = dataReq.iDCardCode;
  const adminName = dataReq.adminName;
  const role = dataReq.role;
  let gender = dataReq.gender;
  const homeTown = dataReq.homeTown;
  const phoneNumber = dataReq.phoneNumber;
  const email = dataReq.email;
  const address = dataReq.address;
  const password = dataReq.password;
  const birthday = dataReq.birthday;
  const basicSalary = dataReq.basicSalary;
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
    `select * from admin where IDCardCode = '${iDCardCode}' or Email = '${email}' or PhoneNumber = '${phoneNumber}'`
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

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới tài khoản quản lý
  const maxCode = await getMaxCode(objName);
  adminCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    adminId &&
    adminCode &&
    iDCardCode &&
    adminName &&
    role &&
    homeTown &&
    phoneNumber &&
    email &&
    address &&
    password &&
    chatId &&
    shopId &&
    basicSalary &&
    req.file
  ) {
    //Mã hóa mật khẩu
    var passEncryption = bcrypt.hashSync(password, 8);
    gender = gender ? gender : 0;
    const avatar = `admins/${req.nameFileImg}`;

    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (AdminId, AdminCode, IDCardCode, AdminName, Role, Gender, Avatar, Birthday, HomeTown, PhoneNumber, Email, BasicSalary, Address, Password, ChatId, ShopId) values ('${adminId}', '${adminCode}', '${iDCardCode}', '${adminName}', ${role}, ${gender}, '${avatar}', ${
        birthday === "" ? null : `'${birthday}'`
      }, '${homeTown}', '${phoneNumber}', '${email}', '${basicSalary}', '${address}', '${passEncryption}', '${chatId}', '${shopId}')`
    )
      .then(() => {
        return res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = "Success")
            )
          );
      })
      .catch((err) => {
        return res
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
    return res
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
 * Cập nhật thông tin tài khoản quản lý cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoAccountAdmin = async (req, res, next) => {
  const dataReq = JSON.parse(req.body.admin);
  //lấy các giá trị request
  let adminId = dataReq.adminId;
  let adminName = dataReq.adminName;
  let gender = dataReq.gender;
  let birthday = dataReq.birthday;
  let address = dataReq.address;
  let homeTown = dataReq.homeTown;
  let basicSalary = dataReq.basicSalary;
  let avatar = null;

  //check id account admin truyền vào rỗng
  if (adminId) {
    try {
      const existAccountAdmin = await checkExist(primaryKeyTable, adminId);

      //check tồn tại account admin có id tương ứng
      if (existAccountAdmin) {
        // Lấy đường dẫn cho ảnh
        if (req.file) {
          avatar = `admins/${req.nameFileImg}`;
          // thực hiện xóa file cũ
          const pathImg = `./public/${existAccountAdmin.Avatar}`;
          if (existAccountAdmin.Avatar) {
            fs.unlinkSync(pathImg);
          }
        } else {
          avatar = existAccountAdmin.Avatar;
        }

        adminName = adminName ? adminName : existAccountAdmin.AdminName;
        gender = gender ? gender : existAccountAdmin.Gender;
        if (existAccountAdmin.Birthday) {
          existAccountAdmin.Birthday = formatDateTimeInsertDB(
            existAccountAdmin.Birthday.toISOString()
          );
        }
        birthday = birthday ? birthday : existAccountAdmin.Birthday;
        address = address ? address : existAccountAdmin.Address;
        homeTown = homeTown ? homeTown : existAccountAdmin.HomeTown;
        basicSalary = basicSalary ? basicSalary : existAccountAdmin.BasicSalary;
        //cập nhật database
        await db.execute(
          `update ${tableName} set AdminName = "${adminName}", Gender = ${gender}, Avatar = '${avatar}', Birthday = ${
            birthday ? `'${birthday}'` : null
          }, Address = "${address}", HomeTown = "${homeTown}", BasicSalary = '${basicSalary}' where ${primaryKeyTable} = "${adminId}"`
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
              (data = "success")
            )
          );
      } else {
        res
          .status(404)
          .send(
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
 * Hàm cập nhật mật khẩu tài khoản admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updatePassAccount = async (req, res, next) => {
  const adminId = req.body.adminId;
  const oldPass = req.body.oldPass;
  const newPass = req.body.newPass;
  if (adminId && oldPass && newPass) {
    try {
      const existAccountAdmin = await checkExist(primaryKeyTable, adminId);
      if (existAccountAdmin) {
        if (bcrypt.compareSync(oldPass, existAccountAdmin.Password)) {
          //Mã hóa mật khẩu
          var passEncryption = bcrypt.hashSync(newPass, 8);
          await db.execute(
            `update ${tableName} set Password = "${passEncryption}" where ${primaryKeyTable} = "${adminId}"`
          );
          res
            .status(200)
            .send(
              new Response(
                (isSuccess = true),
                (errorCode = ""),
                (devMsg = null),
                (userMsg = null),
                (moreInfo = null),
                (data = passEncryption)
              )
            );
        } else {
          res
            .status(200)
            .send(
              new Response(
                (isSuccess = false),
                (errorCode = ""),
                (devMsg = `Password is not correct.`),
                (userMsg = `Mật khẩu cũ nhập không đúng. Vui lòng nhập lại.`),
                (moreInfo = null),
                (data = null)
              )
            );
        }
      } else {
        res
          .status(404)
          .send(
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
 * Xóa tài khoản quản lý cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteAccountAdmin = async (req, res, next) => {
  //lấy các giá trị request
  const adminId = req.body.adminId;
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

  if (adminId) {
    try {
      const existAccountAdmin = await checkExist(primaryKeyTable, adminId);
      if (existAccountAdmin) {
        // thực hiện xóa file ảnh cũ
        const pathImg = `./public/${existAccountAdmin.Avatar}`;
        if (existAccountAdmin.Avatar) {
          fs.unlinkSync(pathImg);
        }
        // Thực hiện xóa trong CSDL
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
      } else {
        res
          .status(404)
          .send(
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

//#region Private Funtion
/**
 * Lấy thông tin admin theo email hoặc số điện thoại
 * @param {*} userName tên đăng nhập
 */
const getAdminByEmailOrPhone = async (userName) => {
  let result = null;
  const sql = `select * from ${tableName} where PhoneNumber = "${userName}" OR Email = "${userName}";`;
  const admin = await db.execute(sql);
  if (admin[0][0]) {
    result = new Admin(
      admin[0][0].AdminId,
      admin[0][0].AdminCode,
      admin[0][0].IDCardCode,
      admin[0][0].AdminName,
      admin[0][0].Role,
      admin[0][0].Gender,
      convertPathFile(admin[0][0].Avatar),
      admin[0][0].Birthday,
      admin[0][0].HomeTown,
      admin[0][0].PhoneNumber,
      admin[0][0].Email,
      admin[0][0].BasicSalary,
      admin[0][0].Address,
      admin[0][0].Password,
      admin[0][0].ChatId,
      admin[0][0].ShopId
    );
  }
  return result;
};
//#endregion

//export controller
module.exports = {
  getAdmins,
  getEmployees,
  getAdminById,
  searchAccountAdmin,
  addNewAccountAdmin,
  updateInfoAccountAdmin,
  updatePassAccount,
  deleteAccountAdmin,
  getAdminByEmailOrPhone,
};
