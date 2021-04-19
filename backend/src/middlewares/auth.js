/**
 * Tạo 1 middleware isAuth có chức năng bảo vệ các api cần bảo mật
 * CreateBy: MTHUNG - 17/04/2021
 */
const jwtHelper = require("../util/jwt.helper");
const Response = require("../models/response");
const { getToken } = require("../controllers/tokens");

//Khai báo cấu hình, khai báo phải theo thứ tự, nhận môi trường theo cấu hình
process.env.NODE_ENV = "development";
const config = require("../../config/config");

// Lấy secretKey
const accessTokenSecret =
  config.env.ACCESS_TOKEN_SECRET || "mthung-admin-access-token";

let isAuth = async (req, res, next) => {
  // Lấy token được gửi từ bên client
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (tokenFromClient) {
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

      // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req
      req.jwtDecoded = decoded;

      //check trường hợp khi người dùng đăng xuất mà token vẫn còn hợp lệ -> xóa token trên db -> kiểm tra có tồn tại token trên db không
      const existToken = await getToken(tokenFromClient);
      if (existToken) {
        // Cho phép req đi tiếp sang controller hay middleware tiếp theo.
        next();
      } else {
        return res
          .status(401)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = null),
              (devMsg = "Can not found token in database"),
              (userMsg = "Không tìm thấy token hoặc token đã hết hạn"),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (error) {
      //Nếu lỗi trả về lỗi xác thực token
      return res
        .status(401)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = null),
            (devMsg = "Unauthenticated token"),
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
  isAuth: isAuth,
};
