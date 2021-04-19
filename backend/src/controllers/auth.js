/**
 * Controller phục vụ login, tạo token và refreshToken - làm mới token khi hết hạn
 * Createby: MTHUNG - 17/04/2020
 */
const jwtHelper = require("../util/jwt.helper");
const { getCustomerByEmailOrPhone } = require("../controllers/customers");
const { getAdminByEmailOrPhone } = require("../controllers/admins");
const Response = require("../models/response");
const bcrypt = require("bcrypt");
const {
  createTokenDB,
  updateToken,
  deleteToken,
} = require("../controllers/tokens");

//Khai báo cấu hình, khai báo phải theo thứ tự, nhận môi trường theo cấu hình
process.env.NODE_ENV = "development";
const config = require("../../config/config");

//lấy thời gian hết hạn của token kể từ khi sinh ra
const accessTokenLife = config.env.ACCESS_TOKEN_LIFE || "5h";

//lấy key secret
const accessTokenSecret =
  config.env.ACCESS_TOKEN_SECRET || "mthung-admin-access-token";

//lấy thời gian sống của refreshToken
const refreshTokenLife = config.env.REFRESH_TOKEN_LIFE || "30d";

//lấy key secret để refresh lại token cung cấp cho client
const refreshTokenSecret =
  config.env.REFRESH_TOKEN_SECRET || "mthung-admin-access-token-refresh";

/**
 * Thực hiện đăng nhập tài khoản
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const loginAuth = async (req, res, next) => {
  try {
    const actor = req.body.actor;
    const dataUser = req.body.dataUser;
    // Xét 2 trường hợp đăng nhập cho admin và customer
    if (actor === "customer" && dataUser.username && dataUser.password) {
      const customer = await getCustomerByEmailOrPhone(dataUser.username);
      // Xét tồn tại khách hàng
      if (customer) {
        // So sánh với mật khẩu đã được mã hóa
        if (bcrypt.compareSync(dataUser.password, customer.password)) {
          const userData = {
            id: customer.customerId,
            phone: customer.phoneNumber,
            email: customer.email,
            password: customer.password,
          };
          // thực hiện tạo token
          const accessToken = await jwtHelper.generateToken(
            userData,
            accessTokenSecret,
            accessTokenLife
          );
          //Thực hiện tạo refresh token
          const refreshToken = await jwtHelper.generateToken(
            userData,
            refreshTokenSecret,
            refreshTokenLife
          );
          // Lưu lại 2 mã access & Refresh token trên db
          await createTokenDB(userData.id, accessToken, refreshToken);

          return res.status(200).send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Login successed!"),
              (userMsg = "Đăng nhập thành công"),
              (moreInfo = null),
              (data = {
                customer,
                accessToken,
              })
            )
          );
        }
      }
      return res.status(404).send(
        new Response(
          (isSuccess = false),
          (errorCode = null),
          (devMsg = "Login failed!"),
          (userMsg = "Đăng nhập thất bại"),
          (moreInfo = null),
          (data = null)
        )
      );
    } else if (actor === "admin" && dataUser.username && dataUser.password) {
      const admin = await getAdminByEmailOrPhone(dataUser.username);
      // Xét tồn tại khách hàng
      if (customer) {
        // So sánh với mật khẩu đã được mã hóa
        if (bcrypt.compareSync(dataUser.password, admin.password)) {
          const userData = {
            _id: admin.adminId,
            _phone: admin.phoneNumber,
            _email: admin.email,
            _password: admin.password,
          };
          // thực hiện tạo token
          const accessToken = await jwtHelper.generateToken(
            userData,
            accessTokenSecret,
            accessTokenLife
          );
          //Thực hiện tạo refresh token
          const refreshToken = await jwtHelper.generateToken(
            userData,
            refreshTokenSecret,
            refreshTokenLife
          );
          // Lưu lại 2 mã access & Refresh token trên db
          await createTokenDB(userData._id, accessToken, refreshToken);

          return res.status(200).send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Login successed!"),
              (userMsg = "Đăng nhập thành công"),
              (moreInfo = null),
              (data = {
                customer,
                accessToken,
              })
            )
          );
        }
      }
      return res.status(404).send(
        new Response(
          (isSuccess = false),
          (errorCode = null),
          (devMsg = "Login failed!"),
          (userMsg = "Đăng nhập thất bại"),
          (moreInfo = null),
          (data = null)
        )
      );
    } else {
      return res
        .status(400)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = null),
            (devMsg = "Bad request: the field actor is null"),
            (userMsg = "Dữ liệu truyền vào đang còn trống."),
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
          (errorCode = null),
          (devMsg = `Internal Server Error : ${err}`),
          (userMsg = "Lỗi hệ thống"),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Thực hiện đăng xuất tài khoản
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 * @returns
 */
const logout = async (req, res, next) => {
  // Lấy refresh token gửi sang
  const refreshTokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // Kiểm tra request trống
  if (refreshTokenFromClient) {
    // Thực hiện xóa token trong DB
    const result = await deleteToken(refreshTokenFromClient);
    return res.status(200).send(
      new Response(
        (isSuccess = true),
        (errorCode = null),
        (devMsg = "Logout successed"),
        (userMsg = "Đăng xuất thành công"),
        (moreInfo = null),
        (data = result)
      )
    );
  } else {
    // Không tìm thấy token trong request
    return res
      .status(403)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB003"),
          (devMsg = "Token in request to blank"),
          (userMsg = "Đăng xuất thất bại"),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Từ refreshToken tạo token mới
 * làm mới lại token khi hết hạn
 * @todo hàm này đang tìm hiểu, bổ sung sau
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 * @returns
 */
const refreshToken = async (req, res, next) => {
  // Lấy refreshToken được gửi lên từ phía client
  const refreshTokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (refreshTokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );
      //   // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req.
      //   req.jwtDecoded = decoded;
      //   // Cho phép req đi tiếp sang controller.
      //   next();

      //Nếu token hợp lệ, nó sẽ cho phép tạo token mới
      const userData = {
        _id: decoded._id,
        _phone: decoded._phone,
        _email: decoded._email,
        _password: decoded._password,
      };
      console.log(userData);
      const accessToken = await jwtHelper.generateToken(
        decoded,
        accessTokenSecret,
        accessTokenLife
      );

      //Cập nhật vào trong Db
      await updateToken(refreshRokenFromClient);

      return res.status(201).send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = null),
          (userMsg = null),
          (moreInfo = null),
          (data = {
            userData,
            accessToken,
          })
        )
      );
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res
        .status(401)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = null),
            (devMsg = `Unauthenticated token: ${error}`),
            (userMsg = "Chưa xác thực được token."),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    // Không tìm thấy token trong request
    return res
      .status(403)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = null),
          (devMsg = "No token provided"),
          (userMsg = "Client không có quyền truy cập vào phần nội dung."),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

module.exports = {
  loginAuth,
  refreshToken,
  logout,
};
