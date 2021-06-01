const express = require("express");
const customerRoutes = require("./src/routes/customers");
const productRoutes = require("./src/routes/products");
const adminRoutes = require("./src/routes/admins");
const shipperRoutes = require("./src/routes/shippers");
const shopRoutes = require("./src/routes/shops");
const categoryRoutes = require("./src/routes/categories");
const cartRoutes = require("./src/routes/carts");
const orderRoutes = require("./src/routes/orders");
const errorRoutes = require("./src/controllers/error");
const authRoutes = require("./src/routes/auth");
const reviewRoutes = require("./src/routes/reviews");
const messageRoutes = require("./src/routes/messages");
const { isAuth } = require("./src/middlewares/auth");
const cors = require("cors");

//Khai báo cấu hình, khai báo phải theo thứ tự, nhận môi trường theo cấu hình
process.env.NODE_ENV = "development";
const config = require("./config/config");

//khởi tạo server
const app = express();

//Bỏ mã hóa cho response trả về, bỏ chặn cors
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //bắt buộc phải có, nếu không req.body sẽ luôn trả về {}
app.use("/public", express.static("public")); //cho phép hiển thị các file public
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", isAuth, customerRoutes);
app.use("/api/reviews", isAuth, reviewRoutes);
app.use("/api", isAuth, shipperRoutes);
app.use("/api", isAuth, shopRoutes);
// app.use("/api", isAuth, cartRoutes);
// app.use("/api", isAuth, orderRoutes);
app.use(errorRoutes.get404);

//Tạo địa chỉ Ip, cổng kết nối cho server
app.listen(config.node_port, config.node_ip, () => {
  console.log(`Server started on port : ${config.node_port}`);
});
