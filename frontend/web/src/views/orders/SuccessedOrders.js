import React, { useState, useEffect, useCallback } from "react";
import {
  CCardBody,
  CCol,
  CDataTable,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";
import { formatShowDate, fomatMoney } from "src/utils/Common";

const SuccessedOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listSuccessedOrder, setListSuccessedOrder] = useState([]);
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
  const admin = useSelector((state) => state.authReducer.admin);

  // Hàm thực hiện lấy danh sách hóa đơn đã thành công
  const getSuccessedOrders = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.125:3000/api/admin/orders?status=4&shopId=${admin.shopId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setListSuccessedOrder(resData.data);
          setIsLoading(false);
          return;
        case 404:
          setListSuccessedOrder([]);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          alert("Lỗi lấy danh sách hóa đơn đã thành công.");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải danh sách hóa đơn bị hủy: ${err}`);
    }
  }, [admin]);

  // Hàm theo dõi để lấy danh sách
  useEffect(() => {
    getSuccessedOrders();
  }, [getSuccessedOrders]);

  // Phần config tên cột, style độ rộng cho từng cột của bảng
  const fields = [
    {
      key: "orderCode",
      label: "Mã đơn",
      _style: { width: "10%" },
    },
    {
      key: "customerCode",
      label: "Mã khách hàng",
      _style: { width: "10%" },
    },
    {
      key: "customerName",
      label: "Tên khách hàng",
      _style: { width: "40%" },
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      _style: { width: "10%" },
    },
    {
      key: "total",
      label: "Tổng tiền",
      _style: { width: "15%" },
    },
    {
      key: "modifyDate",
      label: "Hoàn thành",
      _style: { width: "15%" },
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
                {formatShowDate(dataModal.createDate)}
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
            <table className="table table-bordered mt-3">
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
                  <tr key={item.productCode}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td style={{ textAlign: "right" }}>{item.productAmount}</td>
                    <td style={{ textAlign: "right" }}>
                      {fomatMoney(item.productPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Tổng tiền</th>
                  <th style={{ textAlign: "right" }}>
                    {fomatMoney(dataModal.total)}
                  </th>
                </tr>
              </tfoot>
            </table>
            {/* Thời gian giao hành công */}
            <div
              style={{ backgroundColor: COLORS.grey_3, fontWeight: "bold" }}
              className="d-flex justify-content-between align-items-center mt-3 px-2 py-2"
            >
              <div>ĐƠN HÀNG THÀNG CÔNG LÚC</div>
              <div>{formatShowDate(dataModal.modifyDate)}</div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    );
  };

  // Trường hợp chưa load được dữ liệu
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 pt-5">
        <CSpinner color="info" />
      </div>
    );
  }

  return (
    <CCardBody>
      <DetailModal />
      <CDataTable
        items={listSuccessedOrder}
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
        scopedSlots={{
          total: (item) => <td>{fomatMoney(item.total)}</td>,
          modifyDate: (item) => <td>{formatShowDate(item.modifyDate)}</td>,
        }}
      />
    </CCardBody>
  );
};

export default SuccessedOrders;
