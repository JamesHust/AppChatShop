/**
 * Controller phục vụ login, tạo token và refreshToken - làm mới token khi hết hạn
 * phục vụ cho khách hàng
 * Createby: MTHUNG - 17/04/2020
 */
const jwtHelper = require("../util/jwt.helper");
const { getCustomerByEmailOrPhone } = require("../controllers/customers");
const { getAdminByEmailOrPhone } = require("../controllers/admins");
const { getShipperByEmailOrPhone } = require("../controllers/shippers");
const { checkExist } = require("../util/common");
const { getToken } = require("../controllers/tokens");
const Response = require("../models/response");
const bcrypt = require("bcrypt");
const {
  createTokenDB,
  updateToken,
  deleteToken,
} = require("../controllers/tokens");
const { convertPathFile } = require("../util/common");

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
    if (actor && dataUser.username && dataUser.password) {
      switch (actor) {
        case "customer":
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
                actorCurrent: actor,
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
                    customer: customer,
                    accessToken: accessToken,
                  })
                )
              );
            }
          }
          return res
            .status(404)
            .send(
              new Response(
                (isSuccess = false),
                (errorCode = null),
                (devMsg = "Login failed!"),
                (userMsg = "Đăng nhập thất bại"),
                (moreInfo = null),
                (data = null)
              )
            );
        case "admin":
          const admin = await getAdminByEmailOrPhone(dataUser.username);
          // Xét tồn tại khách hàng
          if (admin) {
            // So sánh với mật khẩu đã được mã hóa
            if (bcrypt.compareSync(dataUser.password, admin.password)) {
              const userData = {
                id: admin.adminId,
                phone: admin.phoneNumber,
                email: admin.email,
                password: admin.password,
                actorCurrent: actor,
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
                    admin: admin,
                    accessToken: accessToken,
                  })
                )
              );
            }
          }
          return res
            .status(404)
            .send(
              new Response(
                (isSuccess = false),
                (errorCode = null),
                (devMsg = "Login failed!"),
                (userMsg = "Đăng nhập thất bại"),
                (moreInfo = null),
                (data = null)
              )
            );
        case "shipper":
          const shipper = await getShipperByEmailOrPhone(dataUser.username);
          // Xét tồn tại shipper
          if (shipper) {
            // So sánh với mật khẩu (mật khẩu shipper không được mã hóa)
            if (dataUser.password === shipper.password) {
              const userData = {
                id: shipper.shipperId,
                phone: shipper.phoneNumber,
                email: shipper.email,
                password: shipper.password,
                actorCurrent: actor,
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
                    shipper: shipper,
                    accessToken: accessToken,
                  })
                )
              );
            }
          }
          return res
            .status(404)
            .send(
              new Response(
                (isSuccess = false),
                (errorCode = null),
                (devMsg = "Login failed!"),
                (userMsg = "Đăng nhập thất bại"),
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
    return res
      .status(200)
      .send(
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
const refreshTokenToLogin = async (req, res, next) => {
  // Lấy refreshToken được gửi lên từ phía client
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    try {
      // Nếu tồn tại token trong cơ sở dữ liệu
      const checkTokenExist = await getToken(token);
      if (checkTokenExist) {
        let user = null;
        // Thực hiện giải mã token xem có hợp lệ hay không?
        const decoded = await jwtHelper.verifyToken(token, accessTokenSecret);
        // kiểm tra token còn hạn không
        if (Date.now() >= decoded.exp * 1000) {
          // Thực hiện giải mã token xem có hợp lệ hay không?
          const decodedRefreshToken = await jwtHelper.verifyToken(
            checkTokenExist.RefreshToken,
            refreshTokenSecret
          );
          if (Date.now() < decodedRefreshToken.exp * 1000) {
            const user = null;
            //Lưu thông tin người dùng
            const userData = {
              id: decodedRefreshToken.data._id,
              phone: decodedRefreshToken.data._phone,
              email: decodedRefreshToken.data._email,
              password: decodedRefreshToken.data._password,
              actorCurrent: decodedRefreshToken.data._actorCurrent,
            };
            const accessToken = await jwtHelper.generateToken(
              userData,
              accessTokenSecret,
              accessTokenLife
            );

            //Cập nhật vào trong Db
            await updateToken(checkTokenExist.RefreshToken, accessToken);

            if (decodedRefreshToken.data._actorCurrent === "customer") {
              user = await checkExist(
                "CustomerId",
                decodedRefreshToken.data._id
              );
              user.Avatar = convertPathFile(user.Avatar);
            }
            // if (decodedRefreshToken._actorCurrent === "admin") {
            //    user = await checkExist("AdminId", decodedRefreshToken.data._id);
            // }
            if (user) {
              return res.status(200).send(
                new Response(
                  (isSuccess = true),
                  (errorCode = null),
                  (devMsg = "Login successed!"),
                  (userMsg = "Đăng nhập thành công"),
                  (moreInfo = null),
                  (data = {
                    customer: user,
                    accessToken: accessToken,
                  })
                )
              );
            }
          }
          return res
            .status(400)
            .send(
              new Response(
                (isSuccess = false),
                (errorCode = null),
                (devMsg =
                  "The token is still valid, but there is no client in the database!"),
                (userMsg = "Đăng nhập thất bại"),
                (moreInfo = null),
                (data = null)
              )
            );
        } else {
          // trường hợp là khách hàng
          if (decoded.data._actorCurrent === "customer") {
            user = await checkExist("CustomerId", decoded.data._id);
          }
          // if (decoded._actorCurrent === "admin") {
          //   user = await checkExist("AdminId", decoded.data._id);
          // }
          // trường hợp là shipper
          if (decoded.data._actorCurrent === "shipper") {
            user = await checkExist("ShipperId", decoded.data._id);
          }
          if (user) {
            user.Avatar = convertPathFile(user.Avatar);
            return res.status(200).send(
              new Response(
                (isSuccess = true),
                (errorCode = null),
                (devMsg = "Login successed!"),
                (userMsg = "Đăng nhập thành công"),
                (moreInfo = null),
                (data = {
                  user: user,
                  accessToken: token,
                })
              )
            );
          } else {
            return res
              .status(400)
              .send(
                new Response(
                  (isSuccess = false),
                  (errorCode = null),
                  (devMsg =
                    "The token is still valid, but there is no client in the database!"),
                  (userMsg = "Đăng nhập thất bại"),
                  (moreInfo = null),
                  (data = null)
                )
              );
          }
        }
      }
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
  }
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
};

module.exports = {
  loginAuth,
  refreshTokenToLogin,
  logout,
};
