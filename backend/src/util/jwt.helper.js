/**
 * Tạo 2 hàm dùng chung của JWT
 * generateToken – tạo token và verifyToken – xác minh token có hợp lệ hay không.
 * Createby: MTHUNG - 17/04/2020
 */
const jwt = require("jsonwebtoken");

/**
 * hàm tạo token
 * @param {*} user thông tin người dùng
 * @param {*} secretSignature key mật
 * @param {*} tokenLife thời gian hết hạn token
 */
let generateToken = (user, secretSignature, tokenLife) => {
  // Định nghĩa những thông tin của user
  const userData = {
    _id: user.id,
    _phone: user.phone,
    _email: user.email,
    _password: user.password,
    _actorCurrent: user.actorCurrent,
  };

  // Thực hiện ký và tạo token
  return jwt.sign(
    { data: userData },
    secretSignature,
    {
      algorithm: "HS256",
      expiresIn: tokenLife,
    }
  );
};

/**
 * hàm xác thực token
 * @param {*} token 
 * @param {*} secretKey khóa mật
 * @returns 
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
