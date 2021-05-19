import React, { useState } from "react";
import {
  CCardBody,
  CCol,
  CDataTable,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const ShippingOrders = () => {
  // Dữ liệu demo
  const usersData = [
    {
      orderId: "60692e32-f9b7-4b8b-ad31-868c18e1435a",
      orderCode: "OD00001",
      orderShippingCode: "BKSHOP_OR00001",
      total: "672,750",
      createDate: "08:20PM 18/05/2021",
      modifyDate: "09:20PM 18/05/2021",
      customerId: "9ba12a52-7b00-41fd-99b8-56d0e44fbcae",
      customerCode: "KH00006",
      customerName: "Mai Thế Hưng",
      phoneNumber: "0966073028",
      shipperCode: "SH00001",
      shipperName: "Cù Trọng Nhân",
      phoneNumberShipper: "0977077557",
      address: "Căn B-108, Tòa nhà C2, Ngoại Giao Đoàn, Cầu Giấy, Hà Nội",
      products: [
        {
          productId: "6ce82a73-3bcd-4e8f-a22a-82e8c584d9a9",
          productCode: "SP00003",
          productName: "Dưa hấu ruột vàng 2.5kg",
          description:
            "Dưa hấu ruột vàng 2.5kg là một đặc sản của đất Long An. Loại dưa này đặc biệt chỉ trồng đc ở 2 nơi duy nhất là Long An và Tiền Giang nước ta, trong đó loại của Long An trái to, vỏ mỏng và đạt độ ngọt cao hơn.",
          unit: "Quả",
          imageUrl: "http://192.168.1.125:3000/public/products/cantaloupe.jpg",
          importPrice: "65000",
          purchasePrice: "74750",
          amount: "78",
          quantitySold: "0",
          dateOfImport: "2020-12-31T17:00:00.000Z",
          rating: "4.6",
          sale: 0,
          shopId: "37ba18b3-f280-4a1c-86ec-a249f99e3405",
          categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
          cartId: "d40b42e8-5cf3-4227-9da6-13b0b8102d8c",
          orderId: "",
          productAmount: "3",
          productPrice: "74,750",
          shopName: "BKShop",
          categoryName: "Trái cây",
        },
        {
          productId: "9f0a3d41-2b00-4c3c-92bc-57ed94c3879f",
          productCode: "SP00005",
          productName: "Bưởi hồng da xanh túi lưới 1.4kg",
          description:
            "Bưởi hồng da xanh túi lưới 1.4kg là một loại quả đặc sản của miền Tây Nam Bộ. Với các múi khi chín màu hồng đỏ rất dễ tách, múi bưởi mọng nước, vị ngọt, mùi thơm khi thưởng thức. Trở thành loại quả được sử dụng phổ biến và được nhiều người ưa chuộng!",
          unit: "Quả",
          imageUrl: "http://192.168.1.125:3000/public/products/grapefruit.jpg",
          importPrice: "60000",
          purchasePrice: "72100",
          amount: "56",
          quantitySold: "0",
          dateOfImport: "2020-12-31T17:00:00.000Z",
          rating: "5",
          sale: 0,
          shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
          categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
          cartId: "d56233ce-d723-40d3-9b71-d528f2c6e8c7",
          orderId: "",
          productAmount: "3",
          productPrice: "72,100",
          shopName: "JamesShop",
          categoryName: "Trái cây",
        },
      ],
    },
    {
      orderId: "26827144-ad84-472f-b0ec-3f839ae9435d",
      orderCode: "OD00002",
      orderShippingCode: "BKSHOP_OR00002",
      total: "688,000",
      createDate: "08:34PM 18/05/2021",
      modifyDate: "09:25PM 18/05/2021",
      customerId: "9ba12a52-7b00-41fd-99b8-56d0e44fbcae",
      customerCode: "KH00002",
      customerName: "Nguyễn Thị Vải",
      phoneNumber: "0966073777",
      shipperCode: "SH00002",
      shipperName: "Nguyễn Thị B",
      phoneNumberShipper: "0911264086",
      address: "Căn B-101, Tòa nhà C5, Ngoại Giao Đoàn, Cầu Giấy, Hà Nội",
      products: [
        {
          productId: "4c9b5b4e-a21a-4608-9dd4-8524e0cee809",
          productCode: "SP00001",
          productName: "Dưa hấu không hạt 2.5kg",
          description:
            "Dưa hấu không hạt là giống quả mới lạ và độc đáo. Quả dưa tròn, da xanh nhạt có gân xanh đậm, vỏ mỏng, nhiều nước, không có hạt và vị ngọt đậm đà.",
          unit: "Quả",
          imageUrl: "http://192.168.1.125:3000/public/products/watermelon.jpg",
          importPrice: "64750",
          purchasePrice: "74750",
          amount: "209",
          quantitySold: "0",
          dateOfImport: "2020-12-31T17:00:00.000Z",
          rating: "4.7",
          sale: 0,
          shopId: "37ba18b3-f280-4a1c-86ec-a249f99e3405",
          categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
          cartId: "d40b42e8-5cf3-4227-9da6-13b0b8102d8c",
          orderId: "",
          productAmount: "10",
          productPrice: "74,750",
          shopName: "BKShop",
          categoryName: "Trái cây",
        },
      ],
    },
  ];
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [dataModal, setDataModal] = useState({
    orderId: "",
    orderCode: "",
    orderShippingCode: "",
    total: "",
    createDate: "",
    modifyDate: "",
    customerId: "",
    customerCode: "",
    customerName: "",
    phoneNumber: "",
    shipperCode: "",
    shipperName: "",
    phoneNumberShipper: "",
    address: "",
    products: [],
  });

  // Phần config tên cột, style độ rộng cho từng cột của bảng
  const fields = [
    {
      key: "orderCode",
      label: "Mã đơn",
      _style: { width: "7%" },
    },
    {
      key: "orderShippingCode",
      label: "Mã đơn ship",
      _style: { width: "10%" },
    },
    {
      key: "customerCode",
      label: "Mã KH",
      _style: { width: "7%" },
    },
    {
      key: "customerName",
      label: "Tên khách hàng",
      _style: { width: "15%" },
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      _style: { width: "9%" },
    },
    {
      key: "shipperCode",
      label: "Mã shipper",
      _style: { width: "8%" },
    },
    {
      key: "shipperName",
      label: "Tên shipper",
      _style: { width: "15%" },
    },
    {
      key: "phoneNumberShipper",
      label: "Liên hệ shipper",
      _style: { width: "10%" },
    },
    {
      key: "total",
      label: "Tổng tiền",
      _style: { width: "8%" },
    },
    {
      key: "modifyDate",
      label: "Bắt đầu ship",
      _style: { width: "10%" },
    },
  ];

  // Hàm xử lý khi click vào từng dòng
  const handlerOnRowClick = (item) => {
    setDataModal({ ...dataModal, ...item });
    setShowModalDetail(true);
  };

  // Modal chi tiết đơn và chuyển sang giai đoạn tiếp theo
  const DetailModal = () => {
    return (
      <CModal
        show={showModalDetail}
        color="info"
        style={{ ...borderCustom }}
        onClose={() => setShowModalDetail(!showModalDetail)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Chi tiết đơn hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Thông tin khách hàng */}
          <div>
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                CHI TIẾT KHÁCH HÀNG
              </div>
            </div>
            <CRow className="mt-2">
              <CCol md="3">Tên khách hàng: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.customerName}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Mã khách hàng: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.customerCode}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Số điện thoại: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.phoneNumber}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Địa chỉ: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.address}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Ngày tạo: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.createDate}
              </CCol>
            </CRow>
          </div>
          {/* Thông tin shipper */}
          <div className="mt-3">
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                THÔNG TIN SHIPPER
              </div>
            </div>
            <CRow className="mt-2">
              <CCol md="3">Tên shipper: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.shipperName}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Mã shipper: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.shipperCode}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Số điện thoại: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.phoneNumberShipper}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="3">Nhận đơn lúc: </CCol>
              <CCol md="9" style={{ fontWeight: "bold" }}>
                {dataModal.modifyDate}
              </CCol>
            </CRow>
          </div>
          <div>
            <div
              style={{ backgroundColor: COLORS.grey_3 }}
              className="d-flex justify-content-between align-items-center mt-3"
            >
              <div style={{ fontWeight: "bold" }} className="px-2 py-2">
                <div>CHI TIẾT ĐƠN HÀNG</div>
              </div>
            </div>
            <table class="table table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: 7 }}>STT</th>
                  <th style={{ width: 120 }}>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: 90 }}>Số lượng</th>
                  <th style={{ width: 120 }}>Giá sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                {dataModal.products.map((item, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td style={{ textAlign: "right" }}>{item.productAmount}</td>
                    <td style={{ textAlign: "right" }}>{item.productPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Tổng tiền</th>
                  <th style={{ textAlign: "right" }}>{dataModal.total}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </CModalBody>
      </CModal>
    );
  };

  return (
    <CCardBody>
      <DetailModal />
      <CDataTable
        items={usersData}
        fields={fields}
        columnFilter
        tableFilter
        footer
        itemsPerPageSelect
        itemsPerPage={10}
        hover
        sorter
        pagination
        onRowClick={(item) => handlerOnRowClick(item)}
      />
    </CCardBody>
  );
};

export default ShippingOrders;
