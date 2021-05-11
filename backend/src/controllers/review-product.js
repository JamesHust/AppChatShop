const { Guid } = require("js-guid");
const db = require("../util/database");
const ReviewProduct = require("../models/review-product");
const DetailProduct = require("../models/detail-product");
const { convertPathFile } = require("../util/common");
const Response = require("../models/response");

//khai báo các biến toàn cục dùng chung
const tableName = "review_product";

//#region API Method
/**
 * Lấy đánh giá theo id khách hàng và id sản phẩm tương ứng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getReview = async (req, res, next) => {
  const idProduct = req.query.idProduct;
  const idCustomer = req.query.idCustomer;
  if (idProduct && idCustomer) {
    try {
      const result = await checkExistReview(idCustomer, idProduct);
      if (result) {
        const review = new ReviewProduct(
          result.Id,
          result.CustomerId,
          result.ProductId,
          result.Rating,
          result.ReviewText,
          result.IsFavourite
        );
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = review)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Data is empty."),
              (userMsg = `Không tìm thấy kết quả`),
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
            (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
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
 * Lấy danh sách sản phẩm yêu thích theo từng khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getListFavouriteProduct = async (req, res, next) => {
  const idCustomer = req.params.idCustomer;
  if (idCustomer) {
    try {
      let wishlist = [];
      const listIdProd = await db.execute(
        `select ProductId from review_product where CustomerId = '${idCustomer}' and IsFavourite = 1`
      );
      if (listIdProd[0].length > 0) {
        await Promise.all(
          listIdProd[0].map(async (item) => {
            const sql = `select p.*, s.ShopName, c.CategoryName from \`product\` p,\`shop\` s,\`category\` c where p.ProductId = '${item.ProductId}' and p.ShopId = s.ShopId and p.CategoryId = c.CategoryId;`;
            const rs = await db.execute(sql);
            const product = rs[0][0];
            wishlist.push(
              new DetailProduct(
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
                "",
                product.CategoryId,
                product.CategoryName,
                product.CartId,
                "",
                "",
                ""
              )
            );
          })
        );
      }
      if (wishlist.length > 0) {
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Get wishlist for customer with id = '${idCustomer}' success!`),
              (userMsg = `Lấy danh sách yêu thích thành công.`),
              (moreInfo = null),
              (data = wishlist)
            )
          );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Customer don't have any favourite product.`),
              (userMsg = `Khách hàng không có sản phẩm yêu thích nào.`),
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
            (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
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
 * Hàm cập nhật hoặc thêm mới đánh giá sản phẩm của khách hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const reviewProduct = async (req, res, next) => {
  const idCustomer = req.body.idCustomer;
  const idProduct = req.body.idProduct;
  let isFavourite = req.body.isFavourite;
  let rating = req.body.rating;
  let reviewText = req.body.reviewText;
  if (idCustomer && idProduct) {
    try {
      let sql;
      const existReview = await checkExistReview(idCustomer, idProduct);
      if (existReview) {
        isFavourite = isFavourite ? isFavourite : existReview.IsFavourite;
        rating = rating ? rating : existReview.Rating;
        reviewText = reviewText ? reviewText : existReview.ReviewText;
        sql = `update ${tableName} set IsFavourite = ${isFavourite}, Rating = ${rating}, ReviewText = '${reviewText}' where Id = '${existReview.Id}';`;
      } else {
        const id = Guid.newGuid().toString();
        isFavourite = isFavourite ? isFavourite : 0;
        rating = rating ? rating : 0;
        reviewText = reviewText ? reviewText : "";
        sql = `insert into ${tableName} (Id, CustomerId, ProductId, Rating, ReviewText, IsFavourite) values ('${id}', '${idCustomer}', '${idProduct}', ${rating}, '${reviewText}', ${isFavourite})`;
      }
      const result = await db.execute(sql);
      res
        .status(200)
        .send(
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
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB001"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
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

//#endregion

//#region Private Method
/**
 * Hàm check tồn tại review
 * @param {*} idCustomer id khách hàng
 * @param {*} idProduct id sản phẩm
 * @returns
 */
const checkExistReview = async (idCustomer, idProduct) => {
  let result = null;
  const sql = `select * from ${tableName} where ProductId = '${idProduct}' and CustomerId = '${idCustomer}';`;
  const rs = await db.execute(sql);
  if (rs[0][0]) {
    result = rs[0][0];
  }
  return result;
};

//#endregion

//export funtion
module.exports = {
  getReview,
  getListFavouriteProduct,
  reviewProduct,
};
