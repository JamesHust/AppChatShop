const { Guid } = require("js-guid");
const db = require("../util/database");
const ProductOrder = require("../models/product-order");

//khai báo các biến toàn cục dùng chung
const tableName = "product_order";

//#region Private Funtion
/**
 * Lấy cả mã, id, số lượng sản phẩm có trong đơn hàng
 * @param {*} orderId Mã đơn hàng
 * @returns Thông tin sản phẩm
 */
const getProductOrders = async (orderId) => {
  let productOrders = [];
  if (orderId) {
    const sql = `select * from ${tableName} where OrderId = '${orderId}';`;
    const result = await db.execute(sql);
    result[0].forEach((item) => {
      productOrder = new ProductOrder(
        item.Id,
        item.ProductId,
        item.ProductAmount,
        item.ProductPrice,
        item.OrderId
      );
      productOrders.push(productOrder);
    });
  }
  return productOrders;
};

/**
 * Lấy sản phẩm có mã sản phẩm trong đơn hàng
 * @param {*} orderId Mã đơn hàng
 * @param {*} productId Mã sản phẩm cần lấy
 * @returns Thông tin sản phẩm
 */
const getDetailProductOrder = async (orderId, productId) => {
  let result = null;
  if (orderId && productId) {
    const sql = `select * from ${tableName} where OrderId = '${orderId}' and ProductId = '${productId}';`;
    const productOrder = await db.execute(sql);
    result = new ProductOrder(
      productOrder[0][0].Id,
      productOrder[0][0].ProductId,
      productOrder[0][0].ProductAmount,
      productOrder[0][0].ProductPrice,
      productOrder[0][0].OrderId
    );
  }
  return result;
};

/**
 * Thêm danh sách sản phẩm vào trong đơn hàng
 * @param {*} listProduct danh sách sản phẩm
 * @returns kết quả thêm
 */
const addProductOrders = async (listProduct) => {
  const result = await Promise.all(
    listProduct.map(async (item) => {
      await addProductOrder(item);
    })
  );
  return result;
};

/**
 * Thêm từng sản phẩm vào trong đơn hàng
 * @param {*} productOrder sản phẩm trong giỏ - object: ProductOrder
 * @returns kết quả thêm
 */
const addProductOrder = async (productOrder) => {
  //Mặc định khi khởi tạo, orderId sẽ có giá trị bằng cartId , cho tiện truy xuất lịch sử sau này
  const orderId = productOrder.cartId;
  //tạo câu lệnh sql
  const sql = `insert into ${tableName} (Id, ProductId, ProductAmount, ProductPrice, OrderId) values ('${productOrder.id}', '${productOrder.productId}', '${productOrder.productAmount}', '${productOrder.productPrice}', '${orderId}')`;
  //thực hiện thêm vào cơ sở dữ liệu
  const result = await db.execute(sql);
  return result;
};
//#endregion

//export funtion
module.exports = {
  getProductOrders,
  getDetailProductOrder,
  addProductOrders,
  addProductOrder,
};
