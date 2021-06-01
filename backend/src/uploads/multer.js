var multer = require("multer");
const { imageFilter } = require("./helper");
const path = require("path");

// Config tên file và vị trí chuyển file ảnh sản phẩm
const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/products"));
  },
  filename: function (req, file, cb) {
    const nameFileImg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    req.nameFileImg = nameFileImg;
    cb(null, nameFileImg);
  },
});

// Config tên file và vị trí chuyển file ảnh đại diện admin
const storageAdmins = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/admins"));
  },
  filename: function (req, file, cb) {
    const nameFileImg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    req.nameFileImg = nameFileImg;
    cb(null, nameFileImg);
  },
});

// Config tên file và vị trí chuyển file ảnh đại diện khách hàng
const storageCustomers = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/customers"));
  },
  filename: function (req, file, cb) {
    const nameFileImg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    req.nameFileImg = nameFileImg;
    cb(null, nameFileImg);
  },
});

// Config tên file và vị trí chuyển file ảnh đại diện shipper
const storageShippers = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/shippers"));
  },
  filename: function (req, file, cb) {
    const nameFileImg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    req.nameFileImg = nameFileImg;
    cb(null, nameFileImg);
  },
});

// Config tên file và vị trí chuyển file ảnh đại diện cửa hàng
const storageShops = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/shops"));
  },
  filename: function (req, file, cb) {
    const nameFileImg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    req.nameFileImg = nameFileImg;
    cb(null, nameFileImg);
  },
});

// upload chung
var upload = multer({ storage: storageProducts });

//upload chỉ mình ảnh sản phẩm
let uploadImageProduct = multer({
  storage: storageProducts,
  fileFilter: imageFilter,
});

//upload chỉ mình ảnh cho admin - quản lý cửa hàng
let uploadImageAdmin = multer({
  storage: storageAdmins,
  fileFilter: imageFilter,
});

//upload chỉ mình ảnh cho khách hàng
let uploadImageCustomer = multer({
  storage: storageCustomers,
  fileFilter: imageFilter,
});

//upload chỉ mình ảnh cho shipper
let uploadImageShipper = multer({
  storage: storageShippers,
  fileFilter: imageFilter,
});

//upload chỉ mình ảnh cho cửa hàng
let uploadImageShop = multer({
  storage: storageShops,
  fileFilter: imageFilter,
});

module.exports = {
  uploadImageProduct,
  uploadImageShipper,
  uploadImageAdmin,
  uploadImageCustomer,
  uploadImageShop,
  upload,
};
