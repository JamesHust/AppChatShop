export const addRequireSourceImg = (path) => {
  return `require("${path}")`;
};

//Hàm thêm '.' vào số
export const addDotToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
