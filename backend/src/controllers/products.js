const db = require("../util/database");
const fs = require("fs");
const Product = require("../models/product");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  formatDateTimeInsertDB,
  convertPathFile,
  formatTimeToInsertDB,
} = require("../util/common");
const Shop = require("../models/shop");
const Category = require("../models/category");

//khai báo các biến toàn cục dùng chung
const tableName = "product";
const objName = "Product";
const primaryKeyTable = "ProductId";
const propName = "ProductName";
const codePropName = "ProductCode";

//#region API function - service
/**
 * Controller lấy danh sách toàn bộ sản phẩm theo loại sản phẩm hoặc theo cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getProducts = (req, res, next) => {
  const categoryId = req.query.categoryId;
  const shopId = req.query.shopId;

  //tạo câu lệnh sql tương ứng
  const sql = createSqlSelect(categoryId, shopId);

  //thực hiện lấy danh sách sản phẩm
  db.execute(sql)
    .then((result) => {
      if (result[0] && result[0].length > 0) {
        let products = [];
        result[0].forEach((item) => {
          const product = new Product(
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
            item.CategoryId
          );
          products.push(product);
        });
        return res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = products)
            )
          );
      } else {
        return res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = "Data is empty."),
              (userMsg = null),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    })
    .catch((err) => {
      console.log("errorr: " + err);
      return res
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
    });
};

/**
 * Controller lấy random sản phẩm theo loại sản phẩm hoặc theo cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getRandomProducts = (req, res, next) => {
  const categoryId = req.query.categoryId;
  const shopId = req.query.shopId;
  const numProducts = req.params.numProducts;

  //tạo câu lệnh sql tương ứng
  let sql = createSqlSelect(categoryId, shopId);
  //xét trường hợp có thêm tham số random số lượng sản phẩm cần lấy
  if (numProducts) {
    sql += ` ORDER BY rand() LIMIT ${numProducts}`;
  }

  //thực hiện lấy danh sách sản phẩm
  db.execute(sql)
    .then((result) => {
      if (result[0] && result[0].length > 0) {
        let products = [];
        result[0].forEach((item) => {
          const product = new Product(
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
            item.CategoryId
          );
          products.push(product);
        });
        res
          .status(200)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = null),
              (userMsg = null),
              (moreInfo = null),
              (data = products)
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
              (userMsg = null),
              (moreInfo = null),
              (data = null)
            )
          );
      }
    })
    .catch((err) => {
      console.log("errorr: " + err);
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
    });
};

/**
 * Lấy sản phẩm theo id sản phẩm
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  //check id có trống không
  if (productId) {
    try {
      const result = await checkExist(primaryKeyTable, productId);
      if (result) {
        const product = new Product(
          result.ProductId,
          result.ProductCode,
          result.ProductName,
          result.Description,
          result.Unit,
          convertPathFile(result.ImageUrl),
          result.ImportPrice,
          result.PurchasePrice,
          result.Amount,
          result.QuantitySold,
          result.DateOfImport,
          result.Rating,
          result.Sale,
          result.ShopId,
          result.CategoryId
        );
        const shop = await checkExist("ShopId", result.ShopId);
        const store = new Shop(
          shop.ShopId,
          shop.ShopCode,
          shop.ShopName,
          shop.Avatar,
          shop.PhoneNumber,
          shop.OtherPhoneNumber,
          shop.Address,
          shop.Email,
          shop.OpenTime,
          shop.CloseTime,
          shop.Rating,
          shop.ChatId
        );
        const category = await checkExist("CategoryId", result.CategoryId);
        const cate = new Category(
          category.CategoryId,
          category.CategoryCode,
          category.CategoryName
        );
        res.status(200).send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = {
              shop: store,
              cate: cate,
              product: product,
            })
          )
        );
      } else {
        res
          .status(404)
          .send(
            new Response(
              (isSuccess = true),
              (errorCode = null),
              (devMsg = `Cannot found product have id=${productId} in the database.`),
              (userMsg = "Không tồn tại sản phẩm cần tìm"),
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
 * Tìm kiếm sản phẩm theo tên hoặc theo mã sản phẩm(phải đúng mã)
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const searchProduct = async (req, res, next) => {
  const searchText = req.query.text;

  //check id có trống không
  if (searchText) {
    try {
      //tạo câu lệnh truy vấn
      let sql = "";
      sql = `select * from ${tableName} where ${propName} LIKE '%${searchText}%' union select * from ${tableName} where ${codePropName} = '${searchText}';`;
      //thực hiện lấy danh sách sản phẩm
      db.execute(sql).then((result) => {
        if (result && result.length > 0) {
          let products = [];
          result[0].forEach((item) => {
            const product = new Product(
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
              item.CategoryId
            );
            products.push(product);
          });
          res
            .status(200)
            .send(
              new Response(
                (isSuccess = true),
                (errorCode = null),
                (devMsg = null),
                (userMsg = null),
                (moreInfo = null),
                (data = products)
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
                (userMsg = `Không tìm thấy kết quả với từ khóa "${searchText}"`),
                (moreInfo = null),
                (data = null)
              )
            );
        }
      });
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
          (isSuccess = true),
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
 * Cập nhật thông tin sản phẩm
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const updateInfoProduct = async (req, res, next) => {
  //lấy các giá trị request
  let productId = req.params.productId;
  let productName = req.body.productName;
  let description = req.body.description;
  let unit = req.body.unit;
  let imageUrl = req.body.imageUrl;
  let importPrice = req.body.importPrice;
  let purchasePrice = req.body.purchasePrice;
  let amount = req.body.amount;
  let quantitySold = req.body.quantitySold;
  let dateOfImport = req.body.dateOfImport;
  let rating = req.body.rating;
  let categoryId = req.body.categoryId;

  //check id sản phẩm truyền vào rỗng
  if (productId) {
    try {
      const existProduct = await checkExist(primaryKeyTable, productId);
      //check tồn tại sản phẩm có id tương ứng
      if (existProduct) {
        const dateTimeDB = formatDateTimeInsertDB(
          existProduct.DateOfImport.toISOString()
        );
        productName =
          productName === undefined ? existProduct.ProductName : productName;
        description =
          description === undefined ? existProduct.Description : description;
        unit = unit === undefined ? existProduct.Unit : unit;
        imageUrl = imageUrl === undefined ? existProduct.ImageUrl : imageUrl;
        importPrice =
          importPrice === undefined ? existProduct.ImportPrice : importPrice;
        purchasePrice =
          purchasePrice === undefined
            ? existProduct.PurchasePrice
            : purchasePrice;
        amount = amount === undefined ? existProduct.Amount : amount;
        quantitySold =
          quantitySold === undefined ? existProduct.QuantitySold : quantitySold;
        dateOfImport = dateOfImport === undefined ? dateTimeDB : dateOfImport;
        rating = rating === undefined ? existProduct.Rating : rating;
        categoryId =
          categoryId === undefined ? existProduct.CategoryId : categoryId;

        //cập nhật database
        const result = await db.execute(
          `update ${tableName} set ProductName = "${productName}", Description = "${description}", Unit = "${unit}", ImageUrl = "${imageUrl}", ImportPrice = "${importPrice}", PurchasePrice = "${purchasePrice}", Amount = "${amount}", QuantitySold = '${quantitySold}', DateOfImport = '${dateOfImport}', Rating = ${rating}, CategoryId = "${categoryId}" where ${primaryKeyTable} = "${productId}"`
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
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = `Cannot found product have id='${productId}' in the database.`),
            (userMsg = `Không tồn tại sản phẩm có id=${productId} cần cập nhật.`),
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
          (moreInfo = null),
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
        (moreInfo = null),
        (data = null)
      )
    );
  }
};

/**
 * Xóa sản phẩm
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteProduct = async (req, res, next) => {
  //lấy các giá trị request
  let productId = req.params.productId;

  if (productId) {
    try {
      const result = await deleteRecord(primaryKeyTable, productId);
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
          (moreInfo = null),
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
        (moreInfo = null),
        (data = null)
      )
    );
  }
};
//#endregion

//#region API for Admin
/**
 * Cập nhật thông tin sản phẩm cho admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateInfoProductAdmin = async (req, res, next) => {
  //lấy các giá trị request
  const dataReq = JSON.parse(req.body.product);
  let productId = dataReq.productId;
  let productName = dataReq.productName;
  let description = dataReq.description;
  let unit = dataReq.unit;
  let importPrice = dataReq.importPrice;
  let purchasePrice = dataReq.purchasePrice;
  let amount = dataReq.amount;
  let quantitySold = dataReq.quantitySold;
  let haveImport = dataReq.haveImport;
  let rating = dataReq.rating;
  let categoryId = dataReq.categoryId;
  let sale = dataReq.sale;
  let dateOfImport = null;
  let imageUrl = null;

  //check id sản phẩm truyền vào rỗng
  if (productId) {
    try {
      const existProduct = await checkExist(primaryKeyTable, productId);
      //check tồn tại sản phẩm có id tương ứng
      if (existProduct) {
        // Cập nhật lại ngày nhập sản phẩm
        if (!haveImport) {
          dateOfImport = formatDateTimeInsertDB(
            existProduct.DateOfImport.toISOString()
          );
        } else {
          dateOfImport = formatTimeToInsertDB(new Date());
        }

        // Lấy đường dẫn cho ảnh
        if (req.file) {
          imageUrl = `products/${req.nameFileImg}`;
          // thực hiện xóa file cũ
          const pathImg = `./public/${existProduct.ImageUrl}`;
          if (existProduct.ImageUrl) {
            fs.unlinkSync(pathImg);
          }
        } else {
          imageUrl = existProduct.ImageUrl;
        }

        productName =
          !productName || productName === ""
            ? existProduct.ProductName
            : productName;
        description =
          !description || description === ""
            ? existProduct.Description
            : description;
        unit = !unit || unit === "" ? existProduct.Unit : unit;

        importPrice =
          !importPrice || importPrice === ""
            ? existProduct.ImportPrice
            : importPrice.split(".").join("");
        purchasePrice =
          !purchasePrice || purchasePrice === ""
            ? existProduct.PurchasePrice
            : purchasePrice.split(".").join("");
        amount = !amount || amount === "" ? existProduct.Amount : amount;
        quantitySold =
          !quantitySold || quantitySold === ""
            ? existProduct.QuantitySold
            : quantitySold;
        rating = !rating || rating === "" ? existProduct.Rating : rating;
        categoryId =
          !categoryId || categoryId === ""
            ? existProduct.CategoryId
            : categoryId;
        sale = !sale ? existProduct.Sale : sale;

        //cập nhật database
        let result = await db.execute(
          `update ${tableName} set ProductName = "${productName}", Description = "${description}", Unit = "${unit}", ImageUrl = "${imageUrl}", ImportPrice = "${importPrice}", PurchasePrice = "${purchasePrice}", Amount = "${amount}", QuantitySold = '${quantitySold}', DateOfImport = '${dateOfImport}', Rating = ${rating}, CategoryId = "${categoryId}", Sale = ${sale} where ${primaryKeyTable} = "${productId}"`
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
              (devMsg = `Cannot found product have id='${productId}' in the database.`),
              (userMsg = `Không tồn tại sản phẩm có id=${productId} cần cập nhật.`),
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
 * Hàm nhập thêm sản phẩm đã có trong kho của admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const importMoreProductAdmin = async (req, res, next) => {
  const importAmount = req.body.importAmount;
  const productId = req.body.productId;
  const dateOfImport = formatTimeToInsertDB(new Date());
  if (importAmount && productId && dateOfImport) {
    const existProduct = await checkExist(primaryKeyTable, productId);
    if (existProduct) {
      const amount = +importAmount + +existProduct.Amount;
      const sql = `update ${tableName} set Amount = ${amount}, DateOfImport ='${dateOfImport}' where ${primaryKeyTable} = "${productId}"`;
      await db.execute(sql);
      res
        .status(200)
        .send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = ""),
            (userMsg = ""),
            (moreInfo = null),
            (data = "success")
          )
        );
    } else {
      res
        .status(404)
        .send(
          new Response(
            (isSuccess = true),
            (errorCode = ""),
            (devMsg = `Cannot found product have id='${productId}' in the database.`),
            (userMsg = `Không tồn tại sản phẩm có id=${productId} cần cập nhật.`),
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
 * Hàm thêm mới sản phẩm của admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const importNewProductAdmin = async (req, res, next) => {
  //lấy các giá trị request
  const dataReq = JSON.parse(req.body.product);
  const productId = Guid.newGuid().toString();
  let productCode = null;
  let productName = dataReq.productName;
  let description = dataReq.description;
  let unit = dataReq.unit;
  let importPrice = dataReq.importPrice;
  let purchasePrice = dataReq.purchasePrice;
  let amount = dataReq.amount;
  let quantitySold = dataReq.quantitySold;
  let rating = dataReq.rating;
  let categoryId = dataReq.categoryId;
  let sale = dataReq.sale;
  let dateOfImport = formatTimeToInsertDB(new Date());
  let imageUrl = `products/${req.nameFileImg}`;
  let shopId = dataReq.shopId;

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới sản phẩm
  const maxCode = await getMaxCode(objName);
  productCode = generateNewCode(maxCode);

  //check dữ liệu truyền vào rỗng
  if (productId) {
    try {
      if (
        req.file &&
        productId &&
        productCode &&
        productName &&
        unit &&
        importPrice &&
        purchasePrice &&
        amount &&
        categoryId &&
        shopId &&
        dateOfImport
      ) {
        //cập nhật database
        await db.execute(
          `insert into ${tableName} (ProductId, ProductCode, ProductName, Description, Unit, ImageUrl, ImportPrice, PurchasePrice, Amount, QuantitySold, DateOfImport, Rating, Sale, ShopId, CategoryId) values ('${productId}', '${productCode}', '${productName}', '${description}', '${unit}', '${imageUrl}', '${importPrice}', '${purchasePrice}', '${amount}', '${quantitySold}', '${dateOfImport}', 0.0, ${sale}, '${shopId}', '${categoryId}')`
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
              (data = "success")
            )
          );
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
    } catch (err) {
      res
        .status(500)
        .send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB002"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không cập nhật được dữ liệu"),
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

//#endregion

//#region Private Function
/**
 * Hàm tạo câu lệnh sql tương ứng
 * @param {*} categoryId Mã loại sản phẩm
 * @param {*} shopId mã cửa hàng
 * @returns câu lệnh sql
 */
const createSqlSelect = (categoryId, shopId) => {
  let sql = "";
  //Xét các trường hợp nếu có thêm tham số categoryId, shopId
  if (!categoryId && !shopId) {
    sql = `SELECT * FROM ${tableName}`;
  } else if (categoryId && shopId) {
    sql = `select * from ${tableName} where CategoryId = "${categoryId}" and ShopId = "${shopId}"`;
  } else {
    if (categoryId) {
      sql = `select * from ${tableName} where CategoryId = "${categoryId}"`;
    } else {
      sql = `select * from ${tableName} where ShopId = "${shopId}"`;
    }
  }
  return sql;
};

/**
 * Hàm cập nhật số lượng sản phẩm trong kho và đã bán
 * @param {*} productId Mã sản phẩm
 * @param {*} quantityExported Số lượng sản phẩm cần xuất kho
 * @returns kết quả cập nhật
 */
const updateAmountProduct = async (productId, quantityExported) => {
  const result = new Response(
    (isSuccess = false),
    (errorCode = ""),
    (devMsg = ""),
    (userMsg = ""),
    (moreInfo = null),
    (data = null)
  );
  const existProduct = await checkExist(primaryKeyTable, productId);
  if (existProduct) {
    //trường hợp số sản phẩm trong kho không còn
    if (
      +existProduct.Amount > 0 &&
      +existProduct.Amount - +quantityExported >= 0
    ) {
      const amount = +existProduct.Amount - +quantityExported;
      const quantitySold = +existProduct.QuantitySold + +quantityExported;
      //tạo câu lệnh sql cập nhật dữ liệu
      const sql = `update ${tableName} set Amount = '${amount}', QuantitySold = '${quantitySold}' where ${primaryKeyTable} = '${productId}'`;
      try {
        result.data = await db.execute(sql);
      } catch (err) {
        result.errorCode = "DB002";
        result.devMsg = err.toString();
        result.userMsg = "Lỗi không cập nhật được dữ liệu";
      }
    } else {
      result.devMsg = `Update failed: the remaining quantity of products is not enough to leave the warehouse. The remaining amount is ${existProduct.Amount}`;
      result.userMsg = `Lỗi cập nhật: số lượng sản phẩm còn lại không đủ để xuất kho. Số sản phẩm còn ${existProduct.Amount}`;
    }
  } else {
    result.devMsg = `Does not exist product with id = '${productId}'`;
    result.userMsg = `Không tồn tại sản phẩm có id = '${productId}'`;
  }
  return result;
};

//#endregion

//#region Test
// /**
//  * Thêm sản phẩm mới
//  * @param {*} req request
//  * @param {*} res response
//  * @param {*} next next sang middleware khác
//  */
//  const addNewProduct = async (req, res, next) => {
//   //lấy các giá trị request
//   const productId = Guid.newGuid().toString();
//   let productCode = null;
//   const productName = req.body.productName;
//   const description =
//     req.body.description === undefined ? "" : req.body.description;
//   const unit = req.body.unit;
//   const imageUrl = req.body.imageUrl;
//   const importPrice = req.body.importPrice;
//   const purchasePrice = req.body.purchasePrice;
//   const amount = req.body.amount;
//   const quantitySold = req.body.quantitySold;
//   const dateOfImport = new Date().toISOString().slice(0, 10);
//   const shopId = req.body.shopId;
//   const categoryId = req.body.categoryId;

//   //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới sản phẩm
//   const maxCode = await getMaxCode(objName);
//   productCode = generateNewCode(maxCode);

//   //check request có trường rỗng
//   if (
//     productId &&
//     productCode &&
//     productName &&
//     unit &&
//     imageUrl &&
//     importPrice &&
//     purchasePrice &&
//     amount &&
//     quantitySold &&
//     dateOfImport &&
//     shopId &&
//     categoryId
//   ) {
//     //thực hiện insert database
//     db.execute(
//       `insert into ${tableName} (ProductId, ProductCode, ProductName, Description, Unit, ImageUrl, ImportPrice, PurchasePrice, Amount, QuantitySold, DateOfImport, Rating, Sale, ShopId, CategoryId) values ('${productId}', '${productCode}', '${productName}', '${description}', '${unit}', '${imageUrl}', '${importPrice}', '${purchasePrice}', '${amount}', '${quantitySold}', '${dateOfImport}', 0.0, 0, '${shopId}', '${categoryId}')`
//     )
//       .then((result) => {
//         res.send(
//           new Response(
//             (isSuccess = true),
//             (errorCode = ""),
//             (devMsg = ""),
//             (userMsg = ""),
//             (moreInfo = null),
//             (data = result)
//           )
//         );
//       })
//       .catch((err) => {
//         res.send(
//           new Response(
//             (isSuccess = false),
//             (errorCode = "DB004"),
//             (devMsg = err.toString()),
//             (userMsg = "Lỗi không thêm mới được dữ liệu"),
//             (moreInfo = null),
//             (data = null)
//           )
//         );
//       });
//   } else {
//     res.send(
//       new Response(
//         (isSuccess = false),
//         (errorCode = ""),
//         (devMsg = "Params in request is null."),
//         (userMsg = "Dữ liệu truyền sang đang để trống."),
//         (moreInfo = null),
//         (data = null)
//       )
//     );
//   }
// };
//#endregion

//export controller
module.exports = {
  getProducts,
  getRandomProducts,
  getProductById,
  searchProduct,
  // addNewProduct,
  updateInfoProduct,
  deleteProduct,
  updateAmountProduct,
  updateInfoProductAdmin,
  importMoreProductAdmin,
  importNewProductAdmin,
};
