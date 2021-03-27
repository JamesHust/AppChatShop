const util = require("util"); //pakage use to show detail object
const db = require("../util/database");

exports.getAddProduct = (req, res, next) => {
  res.send(
    '<form action="/customer" method="POST"><input type="text" name="title"/><button type="submit">OK</button></form>'
  );
};
exports.postAddProduct = (req, res, next) => {
  console.log("Value Text: " + util.inspect(req.body));
  res.redirect("/");
};
exports.getCustomers = (req, res, next) => {
  console.log();
  db.execute("SELECT * FROM customer")
    .then((result) => res.send(
      result[0]
    ))
    .catch((err) => console.log(err));
};
