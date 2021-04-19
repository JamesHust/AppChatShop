const express = require("express");
const {
  getCategories,
  getCategoryById,
  addNewCategory,
  deleteCategory,
} = require("../controllers/categories");
const { isAuth } = require("../middlewares/auth");

//create router for object: product
const router = express.Router();

//Lấy toàn bộ thông tin các Loại sản phẩm
router.get("/categories", getCategories);
//Lấy thông tin chi tiết Loại sản phẩm theo id
router.get("/categories/:categoryId", getCategoryById);
//Thêm Loại sản phẩm mới
router.post("/categories", isAuth, addNewCategory);
//Xóa Loại sản phẩm
router.delete("/categories/:categoryId", isAuth, deleteCategory);

module.exports = router;
