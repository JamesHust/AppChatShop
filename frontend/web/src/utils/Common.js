/**
 * Thêm require cho path ảnh
 * @param {*} path
 * @returns
 */
export const addRequireSourceImg = (path) => {
  return `require("${path}")`;
};

/**
 * Hàm thêm ',' vào số
 * @param {*} number
 * @returns
 */
export const addDotToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Hàm format lại hiển thị thời gian ngày tháng
 * @param {*} dateTime dạng text
 * @returns
 */
export const formatShowDate = (dateTime) => {
  if (dateTime) {
    const date = dateTime.split("T")[0];
    const time = dateTime.split("T")[1].split(".")[0];
    const dateArr = date.split("-");
    const timeArr = time.split(":");
    return `${timeArr[0]}:${timeArr[1]} ${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
  } else return null;
};

/**
 * Format cho hiển thị input type date
 * @param {*} time
 * @returns
 */
export const formatDateInput = (time) => {
  if (time) {
    const dateTime = new Date(
      (typeof time === "string" ? new Date(time) : time).toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Jakarta",
        }
      )
    );
    var dateString =
      dateTime.getFullYear() +
      "-" +
      ("0" + (dateTime.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateTime.getDate()).slice(-2);
    return dateString;
  } else return null;
};

/**
 * Hàm định dạng hiển thị tiền
 */
export const fomatMoney = (money) => {
  if (money != null) {
    return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  } else {
    return (money = " ");
  }
};

/**
 * Format với trường hợp lấy thời gian từ server bị lệch do chênh lệch múi giờ
 * @param {*} time dạng datetime
 * @returns
 */
export const formatDateTime = (time) => {
  const dateTime = new Date(
    (typeof time === "string" ? new Date(time) : time).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  );
  var dateString =
    ("0" + dateTime.getHours()).slice(-2) +
    ":" +
    ("0" + dateTime.getMinutes()).slice(-2) +
    " " +
    ("0" + dateTime.getDate()).slice(-2) +
    "/" +
    ("0" + (dateTime.getMonth() + 1)).slice(-2) +
    "/" +
    dateTime.getFullYear();
  return dateString;
};
