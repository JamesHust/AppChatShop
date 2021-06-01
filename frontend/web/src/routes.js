import { lazy } from "react";
/**
 * Nơi khai báo các screen đã customss
 */
const Home = lazy(() => import("./views/statistical/Home"));
const Products = lazy(() => import("./views/products/Products"));
const ImportProducts = lazy(() => import("./views/products/ImportProducts"));
const ProcessingOrders = lazy(() => import("./views/orders/ProcessingOrders"));
const CompleteOrders = lazy(() => import("./views/orders/CompleteOrders"));
const Employees = lazy(() => import("./views/employees/Employees"));
const Shippers = lazy(() => import("./views/employees/Shippers"));
const CustomerArea = lazy(() => import("./views/customers/CustomerArea"));
const LookupCustomer = lazy(() => import("./views/customers/LookupCustomer"));
const Salary = lazy(() => import("./views/employees/Salary"));
const Account = lazy(() => import("./views/account/Account"));
const Setting = lazy(() => import("./views/setting/Setting"));

/**
 * Nơi config các route cho web
 * Khi thay đổi name => cập nhật lại Breadcrumb
 */
const routes = [
  { path: "/", exact: true, name: "Trang chủ" },
  { path: "/statistical", name: "Thống kê", component: Home },
  { path: "/warehouse", name: "Quản lý kho", component: Products, exact: true },
  { path: "/warehouse/products", name: "Sản phẩm", component: Products },
  { path: "/warehouse/import", name: "Nhập hàng", component: ImportProducts },
  {
    path: "/orders",
    name: "Quản lý đơn hàng",
    component: ProcessingOrders,
    exact: true,
  },
  { path: "/orders/process", name: "Đang xử lý", component: ProcessingOrders },
  {
    path: "/orders/complete",
    name: "Hoàn thành",
    component: CompleteOrders,
  },
  {
    path: "/customers",
    name: "Quản lý khách hàng",
    component: CustomerArea,
    exact: true,
  },
  { path: "/customers/area", name: "Khách hàng khu vực", component: CustomerArea },
  { path: "/customers/lookup", name: "Tra cứu khách hàng", component: LookupCustomer },
  {
    path: "/employees",
    name: "Quản lý nhân sự",
    component: Employees,
    exact: true,
  },
  { path: "/employees/account", name: "Nhân viên", component: Employees },
  { path: "/salary", name: "Tính công", component: Salary },
  { path: "/shippers", name: "Nhân viên giao hàng", component: Shippers },
  { path: "/account", name: "Quản lý tài khoản", component: Account },
  { path: "/setting", name: "Cài đặt", component: Setting },
];

export default routes;
