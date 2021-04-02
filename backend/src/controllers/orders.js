const db = require("../util/database");
const Response = require("../models/response");
const DetailProduct = require("../models/detail-product");
const { updateAmountProduct } = require("./products");
const { getProductOrders, addProductOrders } = require("./product-order");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
} = require("../util/common");
const { getProductCarts } = require("./product-cart");

//khai báo các biến toàn cục dùng chung
const tableName = "order";
const objName = "Order";
const primaryKeyTable = "OrderId";
const codePropName = "OrderCode";
const tableNameReference = "product_order";

//#region region API function - service
const getOrders = async (req, res, next) => {
  const orderCode = req.query.orderCode;
  const shopCode = req.query.shopCode;
  const customerCode = req.query.customerCode;

  //khởi tạo câu lệnh sql với từng trường hợp cụ thể
  const sql = createSqlFilter(orderCode, shopCode, customerCode);

  try {
    const listOrder = await db.execute(sql);
    if(listOrder[0] && listOrder.length > 0){
      const result = listOrder[0];
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Get list order success.`),
          (userMsg = `Lấy danh sách đơn hàng thành công.`),
          (moreInfo = null),
          (data = result)
        )
      );
    }else{
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Can not found any order.`),
          (userMsg = `Không tìm thấy đơn hàng cần tìm.`),
          (moreInfo = "getOrders failed"),
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
        (userMsg = "Lỗi lấy dữ liệu từ cơ sở dữ liệu"),
        (moreInfo = "getOrders failed"),
        (data = null)
      )
    );
  }
};

/**
 * Lấy chi tiết đơn hàng
 * Cho phép lọc theo Mã khách hàng, Mã đơn hàng, Mã cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getDetailProductOrders = async (req, res, next) => {
  const orderCode = req.query.orderCode;
  const shopCode = req.query.shopCode;
  const customerCode = req.query.customerCode;

  //khởi tạo câu lệnh sql với từng trường hợp cụ thể
  const sql = createSqlFilter(orderCode, shopCode, customerCode);

  try {
    let result = [];
    const listOrder = await db.execute(sql);
    await Promise.all(
      listOrder[0].map(async (item) => {
        const productOrder = await getProductsByOrder(item.OrderId);
        const detailProduct = new DetailProduct(
          productOrder.ProductId,
          productOrder.ProductCode,
          productOrder.ProductName,
          productOrder.Description,
          productOrder.ImageUrl,
          productOrder.ImportPrice,
          productOrder.PurchasePrice,
          productOrder.Amount,
          productOrder.QuantitySold,
          productOrder.DateOfImport,
          productOrder.Rating,
          productOrder.Sale,
          productOrder.ShopId,
          productOrder.CategoryId,
          "",
          productOrder.OrderId,
          productOrder.ProductAmount,
          productOrder.ProductPrice
        );
        result.push(detailProduct);
      })
    );
    if (result.length > 0) {
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Get list product of order success.`),
          (userMsg = `Lấy danh sách sản phẩm của đơn hàng thành công.`),
          (moreInfo = null),
          (data = result)
        )
      );
    } else {
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Does not exist list product in order.`),
          (userMsg = `Không tồn tại danh sách sản phẩm trong đơn hàng cần tìm.`),
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
        (userMsg = "Lỗi lấy dữ liệu từ cơ sở dữ liệu"),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Thực hiện đặt hàng
 * Tạo đơn hàng rỗng và thêm sản phẩm từ giỏ hàng sang đơn hàng này
 * Giá trị orderId sẽ bằng cartId - id của giỏ hàng đặt hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const addProductsToOrder = async (req, res, next) => {
  const cartId = req.body.cartId;
  const customerId = req.body.customerId;
  const shopId = req.body.shopId;
  const total = req.body.total;
  if (cartId && customerId && shopId && total) {
    try {
      const listProducts = await getProductCarts(cartId);
      if (listProducts && listProducts.length > 0) {
        const resultCreateOrderEmpty = await createOrder(
          cartId,
          customerId,
          shopId,
          total
        );
        if (resultCreateOrderEmpty) {
          const result = await addProductOrders(listProducts);
          await deleteRecord("CartId", cartId);
          if (result) {
            res.send(
              new Response(
                (isSuccess = true),
                (errorCode = null),
                (devMsg = `Craete order success.`),
                (userMsg = `Tạo đơn hàng thành công.`),
                (moreInfo = null),
                (data = result)
              )
            );
          } else {
            res.send(
              new Response(
                (isSuccess = false),
                (errorCode = "DB004"),
                (devMsg = "Cannot add product to empty order."),
                (userMsg = "Không thể thêm sản phẩm vào đơn hàng rỗng."),
                (moreInfo = "addProductsToOrder error!"),
                (data = null)
              )
            );
          }
        } else {
          res.send(
            new Response(
              (isSuccess = false),
              (errorCode = "DB004"),
              (devMsg = "Cannot create order empty to add products."),
              (userMsg = "Không thể tạo đơn hàng rỗng để thêm sản phẩm"),
              (moreInfo = "addProductsToOrder error!"),
              (data = null)
            )
          );
        }
      } else {
        res.send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB001"),
            (devMsg = `Cannot get list products in cart or does not exist cart with id = '${cartId}'`),
            (userMsg = `Không thể lấy danh sách sản phẩm trong giỏ hoặc không tồn tại giỏ hàng có id = '${cartId}'`),
            (moreInfo = "addProductsToOrder error!"),
            (data = null)
          )
        );
      }
    } catch (err) {
      res.send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB004"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi không thêm mới được dữ liệu"),
          (moreInfo = "addProductsToOrder error!"),
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
        (moreInfo = "addProductsToOrder error!"),
        (data = null)
      )
    );
  }
};

/**
 * Cập nhật lại trạng thái hóa đơn, trừ hủy đơn hàng đã có API khác thay thế
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateOrder = async (req, res, next) => {
  const orderId = req.query.orderId;
  const status = req.query.status;
  if (orderId && status) {
    try {
      const result = await updateStatusOrder(orderId, +status);
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
          (errorCode = "DB002"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi không cập nhật được dữ liệu"),
          (moreInfo = "updateOrder error!"),
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
        (moreInfo = "updateOrder error!"),
        (data = null)
      )
    );
  }
};

/**
 * Hủy đơn hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const cancelOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (orderId) {
    try {
      const existOrder = await getOrderById(orderId);
      if (existOrder) {
        const result = await Promise.all([
          updateStatusOrder(orderId, 5),
          updateAmountOfMutilProduct(orderId),
        ]);
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
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = `Does not exist order with id='${orderId}' in the database.`),
            (userMsg = `Không tồn tại hóa đơn có id=${orderId} cần hủy.`),
            (moreInfo = null),
            (data = null)
          )
        );
      }
    } catch (err) {
      res.send(
        new Response(
          (isSuccess = false),
          (errorCode = "DB002"),
          (devMsg = err.toString()),
          (userMsg = "Lỗi không cập nhật được dữ liệu"),
          (moreInfo = "cancelOrder error!"),
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
        (moreInfo = "cancelOrder error!"),
        (data = null)
      )
    );
  }
};

/**
 * Xóa đơn hàng theo id, bao gồm xóa tất cả sản phẩm trong đơn
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (orderId) {
    try {
      const result = await deleteRecord(primaryKeyTable, orderId);
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
          (moreInfo = "deleteOrder error!"),
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
        (moreInfo = "deleteOrder error!"),
        (data = null)
      )
    );
  }
};
//#endregion

//#region Private Function
/**
 * Lấy danh sách sản phẩm bằng mã hóa đơn
 * @param {*} orderId Mã đơn hàng
 * @returns
 */
const getProductsByOrder = async (orderId) => {
  //tạo câu lệnh sql tương ứng
  const sql = `select p.*, po.ProductAmount, po.ProductPrice, po.OrderId from product p, ${tableNameReference} po where po.OrderId = '${orderId}' and p.ProductId = po.ProductId;`;
  const result = await db.execute(sql);
  return result[0][0];
};

/**
 * Lấy thông tin chi tiết đơn hàng bằng id
 * @param {*} orderId Mã đơn hàng
 * @returns chi tiết đơn hàng
 */
const getOrderById = async (orderId) => {
  //thực hiện tạo giỏ hàng mới
  const result = await checkExist(primaryKeyTable, orderId);
  return result;
};

/**
 * Tạo đơn hàng rỗng mới
 * Mỗi khách hàng sẽ có nhiều đơn hàng, mỗi đơn hàng khi tạo mới sẽ có trạng thái 0 - Đang xử lý
 * @param {*} customerId Mã khách hàng
 * @param {*} shopId Mã cửa hàng
 * @param {*} total Tổng tiền đơn hàng
 * @returns
 */
const createOrder = async (cartId, customerId, shopId, total) => {
  const orderId = cartId;
  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới đơn hàng
  const maxCode = await getMaxCode(objName);
  let orderCode = generateNewCode(maxCode);
  if (!orderCode) {
    orderCode = "OD00001";
  }
  const createDate = new Date().toISOString().slice(0, 10);
  const modifyDate = new Date().toISOString().slice(0, 10);
  if (
    orderId &&
    orderCode &&
    customerId &&
    shopId &&
    total &&
    orderCode &&
    createDate &&
    modifyDate
  ) {
    //tạo câu lệnh sql tương ứngF
    const sql = `insert into \`${tableName}\` (OrderId, ${codePropName}, CustomerId, Total, Status, CreateDate, ModifyDate, ShopId) values ('${orderId}', '${orderCode}', '${customerId}', '${total}', 0, '${createDate}', '${modifyDate}', '${shopId}')`;
    //thực hiện tạo giỏ hàng mới
    const result = await db.execute(sql);
    if (result) {
      return orderId;
    }
  }
  return null;
};

/**
 * Cập nhật trạng thái hóa đơn
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateStatusOrder = async (orderId, status) => {
  if (orderId && status) {
    const existOrder = await getOrderById(orderId);
    if (existOrder) {
      const modifyDate = new Date().toISOString().slice(0, 10);
      //tạo câu lệnh sql tương ứng
      let sql = `update \`${tableName}\` set Status = ${status}, ModifyDate = '${modifyDate}' where OrderId = '${orderId}';`;
      //thực hiện cập nhật đơn hàng
      const result = await db.execute(sql);
      return result;
    }
  }
  return null;
};

/**
 * Cập nhật lại số lượng trong kho của tất cả sản phẩm khi hủy hóa đơn
 * @param {*} orderId Mã hóa đơn
 */
const updateAmountOfMutilProduct = async (orderId) => {
  const listProductOrder = await getProductOrders(orderId);
  const result = await Promise.all(
    listProductOrder.map(async (item) => {
      await updateAmountProduct(item.productId, -item.productAmount);
    })
  );
  return result;
};

const createSqlFilter = (orderCode, shopCode, customerCode) => {
  //khởi tạo câu lệnh sql với từng trường hợp cụ thể
  let sql = `select distinct c1.* from \`${tableName}\` c1 `;
  if (customerCode) {
    sql += `inner join \`${tableName}\` c2 on c1.CustomerCode like '%${customerCode}%' `;
  }
  if (orderCode) {
    sql += `inner join \`${tableName}\` c2 on c1.${codePropName} = '${orderCode}' `;
  }
  if (shopCode) {
    sql += `inner join \`${tableName}\` c3 on c1.ShopCode = '${shopCode}' `;
  }
  return sql;
};
//#endregion

module.exports = {
  getOrders,
  getDetailProductOrders,
  addProductsToOrder,
  updateOrder,
  cancelOrder,
  deleteOrder,
};
