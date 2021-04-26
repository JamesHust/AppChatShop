const { Guid } = require("js-guid");
const db = require("../util/database");
const ProductCart = require("../models/product-cart");

//khai báo các biến toàn cục dùng chung
const tableName = "product_cart";

//#region Private Funtion
/**
 * Lấy cả mã, id, số lượng sản phẩm có trong giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @returns Thông tin sản phẩm
 */
const getProductCarts = async (cartId) => {
  let productCarts = [];
  if (cartId) {
    const sql = `select * from ${tableName} where CartId = '${cartId}';`;
    const result = await db.execute(sql);
    result[0].forEach((item) => {
      productCart = new ProductCart(
        item.Id,
        item.ProductId,
        item.ProductAmount,
        item.ProductPrice,
        item.CartId
      );
      productCarts.push(productCart);
    });
  }
  return productCarts;
};

/**
 * Lấy sản phẩm có mã sản phẩm trong giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @param {*} productId Mã sản phẩm cần lấy
 * @returns Thông tin sản phẩm
 */
const getDetailProductCart = async (cartId, productId) => {
  let result = null;
  if (cartId && productId) {
    const sql = `select * from ${tableName} where CartId = '${cartId}' and ProductId = '${productId}';`;
    const productCart = await db.execute(sql);
    if (productCart[0][0]) {
      result = new ProductCart(
        productCart[0][0].Id,
        productCart[0][0].ProductId,
        productCart[0][0].ProductAmount,
        productCart[0][0].ProductPrice,
        productCart[0][0].CartId
      );
    }
  }
  return result;
};

/**
 * Thêm mới và Cập nhật sản phẩm có trong giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @param {*} productId Mã sản phẩm
 * @param {*} productAmount Số lượng sản phẩm cập nhật
 * @param {*} productPrice Giá sản phẩm
 * @returns kết quả
 */
const updateOrAddProductCart = async (
  cartId,
  productId,
  productAmount,
  productPrice
) => {
  let result;
  //kiểm tra mã giỏ hàng và mã sản phẩm truyền vào có bị trống
  if (cartId && productId && productAmount && productPrice) {
    let sql = "";
    //kiểm tra tồn tại sản phẩm
    const existProductCart = await getDetailProductCart(cartId, productId);
    if (existProductCart) {
      const amount = +existProductCart.productAmount + +productAmount;
      if (amount <= 0) {
        result = await deleteProductCart(existProductCart.id);
      } else {
        sql = `update ${tableName} set ProductAmount = '${amount}', ProductPrice = '${productPrice}' where ProductId = '${productId}' and CartId = '${cartId}'`;
        result = await db.execute(sql);
      }
    } else {
      //thêm mới sản phẩm vào giỏ hàng
      const id = Guid.newGuid().toString();
      sql = `insert into ${tableName} (Id, ProductId, ProductAmount, ProductPrice, CartId) values ('${id}', '${productId}', '${productAmount}', '${productPrice}', '${cartId}')`;
      result = await db.execute(sql);
    }
  }
  return result;
};

/**
 * Xóa sản phẩm khỏi giỏ hàng theo id - khóa chính
 * @param {*} id -khóa chính
 * @returns kết quả
 */
const deleteProductCart = async (id) => {
  let result = null;
  if (id) {
    const sql = `delete from ${tableName} where Id = '${id}'`;
    result = await db.execute(sql);
  }
  return result;
};
//#endregion

//export funtion
module.exports = {
  getProductCarts,
  getDetailProductCart,
  updateOrAddProductCart,
  deleteProductCart,
};
