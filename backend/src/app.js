const express = require("express");
const customerRoutes = require('./routes/customers');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require("./util/database");
const config = require('../config/config.json');
 
//create server
const app = express();
//parse urlencoded in body req
app.use(express.urlencoded({ extended: false }));
db.execute("SELECT * FROM customer")
    .then((result) => {
      result.filter((item => item.forEach(i => console.log(i.name))))
    })
    .catch((err) => console.log(err));
app.use(shopRoutes);
app.use(customerRoutes);
app.use(errorController.get404);

//create port connect server
app.listen(3000, '192.168.1.125', () => {
  console.log(`Server started on port : ${config.development.node_port}`);
});
