const db = require("../util/database");
const DetailProduct = require("../models/detail-product");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  getDetailProductCart,
  addProductCart,
  deleteProductCart,
  updateProductCart,
} = require("./product-cart");
const { convertPathFile } = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "cart";
const tableNameReference = "product_cart";
const primaryKeyTable = "CartId";

//#region API function - service
/**
 * Lấy danh sách id giỏ hàng theo khách hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getCartIdByCustomer = async (req, res, next) => {
  const customerId = req.query.customerId;
  const shopId = req.query.shopId;
  if (customerId && shopId) {
    try {
      const response = getCartIdByCusAndShop(customerId, shopId);
      if (response) {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Does not exist cartId for customerId= ${customerId}.`),
              (userMsg = `Không tồn tại Id giỏ hàng tương ứng với Id khách hàng = ${customerId}.`),
              (moreInfo = null),
              (data = response)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Does not exist cartId for customerId= ${customerId}.`),
              (userMsg = `Không tồn tại Id giỏ hàng tương ứng với Id khách hàng = ${customerId}.`),
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
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Lấy chi tiết toàn bộ giỏ hàng
 * Cho phép lọc theo Mã khách hàng và Mã cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getCarts = async (req, res, next) => {
  const shopId = req.query.shopId;
  const customerId = req.query.customerId;
  let sql = `select distinct c1.${primaryKeyTable} from ${tableName} c1 `;
  if (customerId) {
    sql += `inner join ${tableName} c2 on c1.CustomerId = '${customerId}' `;
  }
  if (shopId) {
    sql += `inner join ${tableName} c3 on c1.ShopId = '${shopId}' `;
  }
  try {
    let result = [];
    const listCartId = await db.execute(sql);
    await Promise.all(
      listCartId[0].map(async (item) => {
        const productCart = await getProductsByCart(item.CartId);
        if (productCart.length && productCart.length > 1) {
          result = [...productCart, ...result];
        } else {
          const detailProduct = new DetailProduct(
            productCart.ProductId,
            productCart.ProductCode,
            productCart.ProductName,
            productCart.Description,
            productCart.Unit,
            convertPathFile(productCart.ImageUrl),
            productCart.ImportPrice,
            productCart.PurchasePrice,
            productCart.Amount,
            productCart.QuantitySold,
            productCart.DateOfImport,
            productCart.Rating,
            productCart.Sale,
            productCart.ShopId,
            productCart.ShopName,
            productCart.CategoryId,
            productCart.CategoryName,
            productCart.CartId,
            "",
            productCart.ProductAmount,
            productCart.ProductPrice
          );
          result.push(detailProduct);
        }
      })
    );
    if (result.length > 0) {
      const rs = classifyShop(result);
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Get list cart success.`),
          (userMsg = `Lấy danh sách giỏ hàng thành công.`),
          (moreInfo = null),
          (data = rs)
        )
      );
    } else {
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = `Does not exist list product in cart.`),
          (userMsg = `Không tồn tại danh sách sản phẩm trong giỏ hàng cần tìm.`),
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
 * Lấy chi tiết giỏ hàng theo id giỏ hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getDetailCartById = async (req, res, next) => {
  const cartId = req.params.cartId;
  if (cartId) {
    try {
      const result = await getProductsByCart(cartId);
      if (result) {
        const detailProduct = new DetailProduct(
          result.ProductId,
          result.ProductCode,
          result.ProductName,
          result.Description,
          convertPathFile(result.ImageUrl),
          result.ImportPrice,
          result.PurchasePrice,
          result.Amount,
          result.QuantitySold,
          result.DateOfImport,
          result.Rating,
          result.Sale,
          result.ShopId,
          result.CategoryId,
          result.CartId,
          "",
          result.ProductAmount,
          result.ProductPrice
        );
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Get detail cart with id = '${cartId}' success.`),
            (userMsg = `Lấy chi tiết giỏ hàng có id = '${cartId}' thành công.`),
            (moreInfo = null),
            (data = detailProduct)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Does not exist cart with id = '${cartId}' in database.`),
            (userMsg = `Không tồn tại giỏ hàng có id = '${cartId}' trong cơ sở dữ liệu.`),
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
  } else {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = null),
        (devMsg = "Params in request is null"),
        (userMsg = null),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const addProductToCart = async (req, res, next) => {
  // const cartId = req.body.cartId;
  const customerId = req.body.customerId;
  const shopId = req.body.shopId;
  const productId = req.body.productId;
  const productPrice = req.body.productPrice;
  const productAmount = req.body.productAmount;
  const costAdded = +productPrice * +productAmount;

  let result = null;
  //check dữ liệu đầu vào bắt buộc phải có
  if (customerId && shopId && productAmount && productPrice && productId) {
    try {
      const cartId = await getCartIdByCusAndShop(customerId, shopId);
      if (cartId) {
        //check tồn tại
        const exitsCart = await getCartById(cartId);
        if (exitsCart) {
          const costAdded = +productPrice * +productAmount;
          result = await Promise.all([
            addProductCart(cartId, productId, productAmount, productPrice),
            updateTotalCart(cartId, costAdded),
          ]);
          res
            .status(200)
            .send(
              new Response(
                (isSuccess = true),
                (errorCode = null),
                (devMsg = "Create cart success!"),
                (userMsg = "Cập nhật giỏ hàng thành công."),
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
                (devMsg = `Cannot found cart have id = '${cartId}' in the database.`),
                (userMsg = `Không tìm thấy giỏ hàng có id = '${cartId}'.`),
                (moreInfo = null),
                (data = null)
              )
            );
        }
      } else {
        const newCartId = await createCart(customerId, shopId, costAdded);
        result = await addProductCart(
          newCartId,
          productId,
          productAmount,
          productPrice
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Create cart success!"),
              (userMsg = "Tạo giỏ hàng thành công."),
              (moreInfo = null),
              (data = result)
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB004"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi thêm mới cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(404)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Cập nhật sản phẩm giỏ hàng
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateProductInCart = async (req, res, next) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;
  const amountUpdate = req.body.amountUpdate;
  if (cartId && productId && amountUpdate) {
    try {
      const result = await updateProductCart(cartId, productId, amountUpdate);
      if (result) {
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Update cart success!"),
              (userMsg = "Cập nhật giỏ hàng thành công"),
              (moreInfo = null),
              (data = null)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = false),
              (errorCode = null),
              (devMsg = "Cannot found product in cart!"),
              (userMsg = "Không thể tìm thấy sản phẩm trong giỏ hàng"),
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
            (userMsg = "Lỗi cập nhật cơ sở dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
    }
  } else {
    res
      .status(404)
      .send(
        new Response(
          (isSuccess = false),
          (errorCode = null),
          (devMsg = "Params in request is null"),
          (userMsg = null),
          (moreInfo = null),
          (data = null)
        )
      );
  }
};

/**
 * Xóa toàn bộ giỏ hàng, bao gồm tất cả sản phẩm trong giỏ
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteCart = async (req, res, next) => {
  const cartId = req.params.cartId;
  let result = null;
  if (cartId) {
    try {
      const sql = `delete from ${tableName} where ${primaryKeyTable} = "${cartId}"`;
      result = await db.execute(sql);
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = "Delete cart success!"),
          (userMsg = "Xóa giỏ hàng thành công."),
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
          (userMsg = "Lỗi xóa dữ liệu trong cơ sở dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = null),
        (devMsg = "Params in request is null"),
        (userMsg = null),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Xóa 1 sản phẩm có trong giỏ hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteProductInCart = async (req, res, next) => {
  const listProd = req.body.listProd;

  if (listProd && listProd.length > 0) {
    let result = [];
    try {
      await Promise.all(
        listProd.map(async (item) => {
          const cartId = item.cartId;
          const productId = item.productId;
          const existProductCart = await getDetailProductCart(
            cartId,
            productId
          );
          if (existProductCart) {
            const rs = await deleteProductCart(existProductCart.id);
            const checkHaveProdInCart = await getProductsByCart(cartId);
            if (!checkHaveProdInCart) {
              await db.execute(
                `delete from ${tableName} where ${primaryKeyTable} = "${cartId}"`
              );
            }
            result.push(rs);
          }
        })
      );
      res.send(
        new Response(
          (isSuccess = true),
          (errorCode = null),
          (devMsg = null),
          (userMsg = null),
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
          (userMsg = "Lỗi xóa dữ liệu trong cơ sở dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
      new Response(
        (isSuccess = false),
        (errorCode = null),
        (devMsg = "Params in request is null"),
        (userMsg = null),
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

//#endregion

//#region Private Function
/**
 * Lấy danh sách sản phẩm có mã giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @returns danh sách sản phẩm
 */
const getProductsByCart = async (cartId) => {
  //tạo câu lệnh sql tương ứng
  const sql = `select p.*, pc.ProductAmount, pc.ProductPrice, pc.CartId, s.ShopName, c.CategoryName from product p, ${tableNameReference} pc, shop s, category c where pc.CartId = '${cartId}' and p.ProductId = pc.ProductId and p.ShopId = s.ShopId and p.CategoryId = c.CategoryId;`;
  const result = await db.execute(sql);
  if (result && result.length > 0) {
    if (result[0].length > 1) {
      const listRs = [];
      result[0].map(async (item) => {
        const detailProduct = new DetailProduct(
          item.ProductId,
          item.ProductCode,
          item.ProductName,
          item.Description,
          item.Unit,
          convertPathFile(item.ImageUrl),
          item.ImportPrice,
          item.PurchasePrice,
          item.Amount,
          item.QuantitySold,
          item.DateOfImport,
          item.Rating,
          item.Sale,
          item.ShopId,
          item.ShopName,
          item.CategoryId,
          item.CategoryName,
          item.CartId,
          "",
          item.ProductAmount,
          item.ProductPrice
        );
        listRs.push(detailProduct);
      });
      return listRs;
    } else return result[0][0];
  } else return null;
};

/**
 * Lấy danh sách sản phẩm có mã giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @returns danh sách sản phẩm
 */
const getCartIdByCusAndShop = async (customerId, shopId) => {
  //tạo câu lệnh sql tương ứng
  let sql = `select CartId from ${tableName} where CustomerId = '${customerId}' and ShopId ='${shopId}';`;
  const result = await db.execute(sql);
  if (result[0][0]) {
    return result[0][0].CartId;
  }
  return null;
};

/**
 * Lấy thông tin chi tiết giỏ hàng bằng id
 * @param {*} cartId Mã giỏ hàng
 * @returns chi tiết giỏ hàng
 */
const getCartById = async (cartId) => {
  //tạo câu lệnh sql tương ứng
  const sql = `select * from ${tableName} where CartId = '${cartId}';`;
  //thực hiện tạo giỏ hàng mới
  const result = await db.execute(sql);
  return result[0][0];
};

/**
 * Tạo giỏ hàng rỗng mới
 * Mỗi khách hàng sẽ có nhiều giỏ hàng chưa thanh toán, mỗi giỏ hàng sẽ tương ứng với
 * @param {*} customerId Mã khách hàng
 * @param {*} shopId Mã cửa hàng
 * @param {*} total Tổng tiền hiện tại của giỏ
 * @returns kết quat tạo
 */
const createCart = async (customerId, shopId, total) => {
  const cartId = Guid.newGuid().toString();
  if (customerId && shopId && total && cartId) {
    //tạo câu lệnh sql tương ứng
    const sql = `insert into ${tableName} (CartId, CustomerId, Total, ShopId) values ('${cartId}', '${customerId}', '${total}', '${shopId}')`;
    //thực hiện tạo giỏ hàng mới
    const result = await db.execute(sql);
    if (result) {
      return cartId;
    }
  }
  return null;
};

/**
 * Cập nhật tổng tiền giỏ hàng
 * Mỗi khi khách hàng thêm sản phẩm vào giỏ sẽ cập nhật là tổng tiền của giỏ hàng
 * @param {*} cartId Mã giỏ hàng
 * @param {*} costAdded Tiền thêm, bớt. (+) với trường hợp tăng, (-) với trường hợp giảm
 * @returns
 */
const updateTotalCart = async (cartId, costAdded) => {
  const cartOld = await getCartById(cartId);
  if (cartOld) {
    const total = +cartOld.Total + +costAdded;
    //tạo câu lệnh sql tương ứng
    let sql = `update ${tableName} set Total = '${total}' where CartId = '${cartId}';`;
    //thực hiện tạo giỏ hàng mới
    const result = await db.execute(sql);
    return result;
  } else return null;
};

/**
 * Hàm phân loại sản phẩm theo cửa hàng
 * @param {*} data
 */
const classifyShop = (data) => {
  const dt = data.map((i) => i.shopId);
  const listShop = dt.filter((value, index) => dt.indexOf(value) == index);

  let list = [];
  listShop.forEach((i) => {
    let itemRs = [];
    data.forEach((item) => {
      if (item.shopId == i) {
        itemRs.push(item);
      }
    });
    list.push(itemRs);
  });
  return list;
};
//#endregion

//export controller
module.exports = {
  getCarts,
  getCartIdByCustomer,
  getDetailCartById,
  addProductToCart,
  updateProductInCart,
  deleteCart,
  deleteProductInCart,
};
