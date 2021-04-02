const db = require("../util/database");
const Category = require("../models/category");
const Response = require("../models/response");
const { Guid } = require("js-guid");
const {
  generateNewCode,
  getMaxCode,
  checkExist,
  deleteRecord,
  formatDateTimeInsertDB,
} = require("../util/common");

//khai báo các biến toàn cục dùng chung
const tableName = "category";
const objName = "Category";
const primaryKeyTable = "CategoryId";
const propName = "CategoryName";
const codePropName = "CategoryCode";

//#region API function - service
/**
 * Controller lấy danh sách toàn bộ sản phẩm theo loại sản phẩm hoặc theo cửa hàng
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const getCategories = (req, res, next) => {
  //tạo câu lệnh sql tương ứng
  const sql = `select * from ${tableName}`;

  //thực hiện lấy danh sách sản phẩm
  db.execute(sql)
    .then((result) => {
      if (result && result.length > 0) {
        let categories = [];
        result[0].forEach((item) => {
          const category = new Category(
            item.CategoryId,
            item.CategoryCode,
            item.CategoryName
          );
          categories.push(category);
        });
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = categories)
          )
        );
      } else {
        res.send(
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
      res.send(
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
const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  //check id có trống không
  if (categoryId) {
    try {
      const result = await checkExist(primaryKeyTable, categoryId);
      if (result) {
        const category = new Category(
          result.CategoryId,
          result.CategoryCode,
          result.CategoryName
        );
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = null),
            (userMsg = null),
            (moreInfo = null),
            (data = category)
          )
        );
      } else {
        res.send(
          new Response(
            (isSuccess = true),
            (errorCode = null),
            (devMsg = `Cannot found category have id=${categoryId} in the database.`),
            (userMsg = "Không tồn tại Loại sản phẩm cần tìm"),
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
          (userMsg = "Lỗi lấy được dữ liệu từ cơ sở dữ liệu"),
          (moreInfo = null),
          (data = null)
        )
      );
    }
  } else {
    res.send(
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
 * Thêm Loại sản phẩm mới
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const addNewCategory = async (req, res, next) => {
  //lấy các giá trị request
  const categoryId = Guid.newGuid().toString();
  let categoryCode = null;
  const categoryName = req.body.categoryName;

  //Lấy mã code lớn nhất và tạo mã code mới khi thêm mới sản phẩm
  const maxCode = await getMaxCode(objName);
  categoryCode = generateNewCode(maxCode);

  //check request có trường rỗng
  if (
    categoryId &&
    categoryCode &&
    categoryName
  ) {
    //thực hiện insert database
    db.execute(
      `insert into ${tableName} (CategoryId, CategoryCode, CategoryName) values ('${categoryId}', '${categoryCode}', '${categoryName}')`
    )
      .then((result) => {
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
      })
      .catch((err) => {
        res.send(
          new Response(
            (isSuccess = false),
            (errorCode = "DB004"),
            (devMsg = err.toString()),
            (userMsg = "Lỗi không thêm mới được dữ liệu"),
            (moreInfo = null),
            (data = null)
          )
        );
      });
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
 * Xóa Loại sản phẩm
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next sang middleware khác
 */
const deleteCategory = async (req, res, next) => {
  //lấy các giá trị request
  let categoryId = req.params.categoryId;

  if (categoryId) {
    try {
      const result = await deleteRecord(primaryKeyTable, categoryId);
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

//#region Private Function
//#endregion

//export controller
module.exports = {
  getCategories,
  getCategoryById,
  addNewCategory,
  deleteCategory,
};
