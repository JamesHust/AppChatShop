const db = require("../util/database");
const Customer = require("../models/customer");
const Response = require("../models/response");
const bcrypt = require("bcrypt");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
} = require("../util/common");
const { convertPathFile } = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "customer";
const objName = "Customer";
const primaryKeyTable = "CustomerId";

//#region API function - service
/**
 * Controller lấy danh sách toàn bộ khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getCustomers = (req, res, next) => {
  db.execute(`SELECT * FROM ${tableName}`)
    .then((result) => {
      if (result && result.length > 0) {
        let customers = [];
        result[0].forEach((item) => {
          const customer = new Customer(
            item.CustomerId,
            item.CustomerCode,
            item.CustomerName,
            convertPathFile(item.Avatar),
            item.PhoneNumber,
            item.OtherPhoneNumber,
            item.Address,
            item.Email,
            item.Password,
            item.ChatId
          );
          customers.push(customer);
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
              (data = customers)
            )
          );
      } else {
        res.send(
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
    })
    .catch((err) => {
      console.log("errorr: " + err);
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
 * Lấy khách hàng theo id khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getCustomerById = async (req, res, next) => {
  const customerId = req.params.customerId;
  //check param id
  if (customerId) {
    try {
      const result = await checkExist(primaryKeyTable, customerId);
      if (result) {
        const customer = new Customer(
          result.CustomerId,
          result.CustomerCode,
          result.CustomerName,
          convertPathFile(result.Avatar),
          result.PhoneNumber,
          result.OtherPhoneNumber,
          result.Address,
          result.Email,
          result.Password,
          result.ChatId
        );
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = customer)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Cannot found customer have id=${customerId} in the database.`),
            (userMsg = "Không tồn tại khách hàng cần tìm"),
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
 * Lấy số lượt đánh giá và số lượt mua hàng thành công của khách hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getRateAndOrders = async (req, res, next) => {
  const customerId = req.query.customerId;
  if (customerId) {
    try {
      let review = 0;
      let timesOfOrder = 0;
      // Lấy số lượt đánh giá của khách hàng
      const responseRw = await db.execute(
        `select count(*) as reviews from \`review_product\` where CustomerId = "${customerId}";`
      );
      if (responseRw[0][0].reviews) {
        review = +responseRw[0][0].reviews;
      }
      // Lấy số lượt đặt hàng thành công
      const responseOr = await db.execute(
        `select count(*) as orders from \`order\` where CustomerId = "${customerId}" and Status ="3";`
      );
      if (responseOr[0][0].orders) {
        timesOfOrder = responseOr[0][0].orders;
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
            (data = { review: review, timesOfOrder: timesOfOrder })
          )
        );
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
 * Tạo tài khoản khách hàng mới
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const createNewCustomer = async (req, res, next) => {
  //lấy các giá trị request
  const customerId = Guid.newGuid().toString();
  let customerCode = null;
  const customerName = req.body.customerName;
  const avatar = req.body.avatar;
  const phoneNumber = req.body.phoneNumber;
  const otherPhoneNumber = req.body.otherPhoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const chatId = Guid.newGuid().toString();

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới khách hàng
  const maxCode = await getMaxCode(objName);
  customerCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    customerId &&
    customerCode &&
    customerName &&
    phoneNumber &&
    address &&
    email &&
    password &&
    chatId
  ) {
    //Mã hóa mật khẩu
    var passEncryption = bcrypt.hashSync(password, 8);

    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (CustomerId, CustomerCode, CustomerName, Avatar, PhoneNumber, OtherPhoneNumber, Address, Email, Password, ChatId) values ('${customerId}', '${customerCode}', '${customerName}', '${avatar}', '${phoneNumber}', '${otherPhoneNumber}', '${address}', '${email}', '${passEncryption}', '${chatId}')`
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
        console.log("errorr: " + err);
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
 * Cập nhật thông tin khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoCustomer = async (req, res, next) => {
  //lấy các giá trị request
  let customerId = req.params.customerId;
  let customerName = req.body.customerName;
  let avatar = req.body.avatar;
  let phoneNumber = req.body.phoneNumber;
  let otherPhoneNumber = req.body.otherPhoneNumber;
  let address = req.body.address;
  let email = req.body.email;
  let password = req.body.password;
  let oldPass = req.body.oldPass;

  //check id khách hàng truyền vào rỗng
  if (customerId) {
    try {
      const existCustomer = await checkExist(primaryKeyTable, customerId);
      // Check trường hợp đổi mật khẩu
      if (oldPass) {
        if (!bcrypt.compareSync(oldPass, existCustomer.Password)) {
          return res
            .status(400)
            .send(
              new Response(
                (isSuccess = true),
                (errorCode = ""),
                (devMsg = "Old password is incorrect"),
                (userMsg = "Mật khẩu cũ xác thực không đúng"),
                (moreInfo = null),
                (data = null)
              )
            );
        }
      }
      //Mã hóa mật khẩu
      var passEncryption = bcrypt.hashSync(password, 8);

      //check tồn tại khách hàng có id tương ứng
      if (existCustomer) {
        customerName =
          customerName === undefined
            ? existCustomer.CustomerName
            : customerName;
        avatar = avatar === undefined ? existCustomer.Avatar : avatar;
        phoneNumber =
          phoneNumber === undefined ? existCustomer.PhoneNumber : phoneNumber;
        otherPhoneNumber =
          otherPhoneNumber === undefined
            ? existCustomer.OtherPhoneNumber
            : otherPhoneNumber;
        address = address === undefined ? existCustomer.Address : address;
        email = email === undefined ? existCustomer.Email : email;
        password =
          password === undefined ||
          bcrypt.compareSync(password, existCustomer.Password)
            ? existCustomer.Password
            : passEncryption;
        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set CustomerName = "${customerName}", Avatar = "${avatar}", PhoneNumber = "${phoneNumber}", OtherPhoneNumber = "${otherPhoneNumber}", Address = "${address}", Email = "${email}", Password = "${password}" where ${primaryKeyTable} = "${customerId}"`
        );
        return res.send(
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
        return res
          .status(404)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = ""),
              (devMsg = "Data is not exist in database"),
              (userMsg =
                "Không tồn tại khách hàng có mã Id tương ứng trong CSDL"),
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
            (errorCode = "DB002"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không thêm mới được dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
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
 * Xóa tài khoản khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteAccountCustomer = async (req, res, next) => {
  //lấy các giá trị request
  let customerId = req.params.customerId;

  if (customerId) {
    try {
      const result = await deleteRecord(primaryKeyTable, customerId);
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

//#region Private Funtion
/**
 * Lấy thông tin customer theo email hoặc số điện thoại
 * @param {*} userName tên đăng nhập
 */
const getCustomerByEmailOrPhone = async (userName) => {
  let result = null;
  const sql = `select * from ${tableName} where PhoneNumber = "${userName}" OR Email = "${userName}";`;
  const customer = await db.execute(sql);
  if (customer[0][0]) {
    result = new Customer(
      customer[0][0].CustomerId,
      customer[0][0].CustomerCode,
      customer[0][0].CustomerName,
      convertPathFile(customer[0][0].Avatar),
      customer[0][0].PhoneNumber,
      customer[0][0].OtherPhoneNumber,
      customer[0][0].Address,
      customer[0][0].Email,
      customer[0][0].Password,
      customer[0][0].ChatId
    );
  }
  return result;
};
//#endregion

//export controller
module.exports = {
  getCustomers,
  getCustomerById,
  getRateAndOrders,
  createNewCustomer,
  updateInfoCustomer,
  deleteAccountCustomer,
  getCustomerByEmailOrPhone,
};
