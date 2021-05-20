const db = require("../util/database");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const DetailProduct = require("../models/detail-product");
const {
  updateStatusOrder,
  getOrderById,
  updateAmountOfMutilProduct,
  addReasonForCancelOrder,
  getProductsByOrder,
} = require("./orders");
const { convertPathFile } = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "delivery_order";
const primaryKeyTable = "Id";

//#region region API function - service
/**
 * Hàm thực hiện nhận giao hàng của shipper
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const receiveOrder = async (req, res, next) => {
  const shipperId = req.body.shipperId;
  const orderId = req.body.orderId;
  const orderCode = req.body.orderCode;
  const shopCode = req.body.shopCode;
  if (shipperId && orderId && shopCode && orderCode) {
    try {
      await Promise.all([
        createDeliveryOrder(shopCode, shipperId, orderCode, orderId),
        updateStatusOrder(orderId, 2),
      ]);
      res
        .status(200)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = null),
            (devMsg = `Craete order success.`),
            (userMsg = `Tạo đơn hàng thành công.`),
            (moreInfo = null),
            (data = "success")
          )
        );
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB004"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi thêm vào cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
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
 * Hàm lấy đơn hàng đã nhận theo id shipper
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getReceivedOrders = async (req, res, next) => {
  const shipperId = req.params.shipperId;
  if (shipperId) {
    try {
      let result = [];
      const list = await getDeliveryOrdersByShipper(shipperId);
      if (list) {
        await Promise.all(
          list.map(async (item) => {
            const res = await getDetailMission(item.OrderId);
            if (res.Status === 2) {
              const mission = {
                orderId: item.OrderId,
                orderCode: res.OrderCode,
                orderShipCode: item.DeliveryOrderCode,
                total: res.Total,
                shippingCost: item.ShippingCost,
                receivedTime: res.ModifyDate,
                shopName: res.ShopName,
                shopAddress: res.ShopAddress,
                shopPhone: res.ShopPhone,
                customerName: res.CustomerName,
                customerAddress: res.CustomerAddress,
                customerPhone: res.CustomerPhone,
              };
              result.push(mission);
            }
          })
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = null),
              (devMsg = `Get received orders success.`),
              (userMsg = `Lấy danh sách đơn hàng cần giao của shipper thành công.`),
              (moreInfo = null),
              (data = result)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Does not exist order.`),
              (userMsg = `Không tồn tại đơn hàng cần tìm.`),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
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
  } else {
    res
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
 * Lấy tổng tiền công nợ cần trả lại cho cửa hàng của shipper
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getSumDeptForShipper = async (req, res, next) => {
  const shopId = req.query.shopId;
  const shipperId = req.query.shipperId;
  if (shopId && shipperId) {
    try {
      const sql = `select o.Total, s.ShopName from ${tableName} d, \`order\` o, shop s where d.ShipperId = "${shipperId}" and d.OrderId = o.OrderId and o.ShopId = s.ShopId and o.Status IN (2,3) and s.ShopId = "${shopId}";`;
      const listItem = await db.execute(sql);
      if (listItem[0].length > 0) {
        let result = 0;
        listItem[0].forEach((item) => {
          result += +item.Total;
        });
        res.status(200).send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = ""),
            (userMsg = ""),
            (moreInfo = null),
            (data = {
              totalPayment: +result,
              shopName: listItem[0][0].ShopName,
            })
          )
        );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
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
  } else {
    res
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
 * Hàm lấy lịch sử
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getHistorySuccessDelive = async (req, res, next) => {
  const shopId = req.query.shopId;
  const shipperId = req.query.shipperId;
  if (shopId && shipperId) {
    try {
      const sql = `select d.DeliveryOrderCode, d.ShippingCost, o.Total from ${tableName} d, \`order\` o where d.ShipperId = '${shipperId}' and d.OrderId = o.OrderId and o.ShopId = '${shopId}' and DATE(\`ModifyDate\`) = CURDATE() and o.Status IN (3,4)`;
      const result = await db.execute(sql);
      if (result[0].length > 0) {
        let listRs = [];
        result[0].forEach((i) => {
          listRs.push({
            orderShipCode: i.DeliveryOrderCode,
            shippingCost: i.ShippingCost,
            payment: i.Total,
          });
        });
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = listRs)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
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
  } else {
    res
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
 * Hàm lấy chi tiết danh sách sản phẩm trong các đơn hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getDetailCancelOrders = async (req, res, next) => {
  const shopId = req.query.shopId;
  const shipperId = req.query.shipperId;
  if (shopId && shipperId) {
    try {
      const listItem = await getDeliveryOrdersByShipper(shipperId);
      if (listItem.length > 0) {
        let result = [];
        await Promise.all(
          listItem.map(async (item) => {
            const productOrders = await getProductsByOrder(item.OrderId);
            let products = [];
            productOrders.forEach((product) => {
              const detailProduct = new DetailProduct(
                product.ProductId,
                product.ProductCode,
                product.ProductName,
                product.Description,
                product.Unit,
                convertPathFile(product.ImageUrl),
                product.ImportPrice,
                product.PurchasePrice,
                product.Amount,
                product.QuantitySold,
                product.DateOfImport,
                product.Rating,
                product.Sale,
                product.ShopId,
                product.ShopName,
                convertPathFile(product.Avatar),
                product.CategoryId,
                product.CategoryName,
                "",
                product.OrderId,
                product.ProductAmount,
                product.ProductPrice
              );
              products.push(detailProduct);
            });
            result.push({
              orderShipCode: item.DeliveryOrderCode,
              products: products,
            });
          })
        );
        res
          .status(200)
          .send(
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
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = ""),
              (devMsg = ""),
              (userMsg = ""),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
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
  } else {
    res
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
 * Hàm hủy đơn hàng cho shipper
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const cancelOrderForShipper = async (req, res, next) => {
  const reason = req.body.reason;
  const orderId = req.body.orderId;
  if (reason && orderId) {
    try {
      const existOrder = await getOrderById(orderId);
      if (existOrder) {
        const result = await Promise.all([
          updateStatusOrder(orderId, 6), //6 - trạng thái đơn hàng bị hủy nhưng cửa hàng chưa nhận lại được sản phẩm
          addReasonForCancelOrder(orderId, reason),
        ]);
        res
          .status(200)
          .send(
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
        res
          .status(404)
          .send(
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
      res
        .status(500)
        .send(
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
    res
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
 * Xóa đơn hàng đang được giao
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteDeliveryOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  if (orderId) {
    try {
      const result = await db.execute(
        `delete from ${tableName} where OrderId = "${orderId}"`
      );
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
    res
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
//#endregion

//#region Private Method
/**
 * Hàm tạo đơn vận chuyển khi shipper nhận hàng
 * @param {*} shopCode Mã cửa hàng
 * @param {*} shipperId Id shipper
 * @param {*} orderCode Mã đơn hàng
 * @param {*} orderId Id đơn hàng
 */
const createDeliveryOrder = async (shopCode, shipperId, orderCode, orderId) => {
  const id = Guid.newGuid().toString();
  const deliveryOrderCode = `${shopCode}_${orderCode}`;
  const shippingCost = 15000;
  const sql = `insert into ${tableName} (Id, DeliveryOrderCode, ShippingCost, ShipperId, OrderId) values ('${id}', '${deliveryOrderCode}', '${shippingCost}', '${shipperId}', '${orderId}')`;
  await db.execute(sql);
};

/**
 * hàm lấy toàn bộ đơn hàng cần giao của shipper
 * @param {*} shipperId
 * @returns
 */
const getDeliveryOrdersByShipper = async (shipperId) => {
  let result = null;
  const sql = `select * from ${tableName} where ShipperId = '${shipperId}'`;
  const res = await db.execute(sql);
  if (res[0].length > 0) {
    result = res[0];
  }
  return result;
};

/**
 * Lấy thông tin nhiệm vụ cho shipper
 * @param {*} orderId
 * @returns
 */
const getDetailMission = async (orderId) => {
  const sql = `select s.ShopName, s.Address as ShopAddress, s.PhoneNumber as ShopPhone, c.CustomerName, c.Address as CustomerAddress, c.PhoneNumber as CustomerPhone, o.OrderCode, o.Total, o.Status, o.ModifyDate from \`order\` o, customer c, shop s where o.OrderId = '${orderId}' and o.CustomerId = c.CustomerId and o.ShopId = s.ShopId;`;
  const result = await db.execute(sql);
  return result[0][0];
};
//#endregion

module.exports = {
  receiveOrder,
  getReceivedOrders,
  deleteDeliveryOrder,
  cancelOrderForShipper,
  getSumDeptForShipper,
  getHistorySuccessDelive,
  getDetailCancelOrders,
};
