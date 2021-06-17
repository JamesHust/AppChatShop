import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CRow,
  CCol,
  CImg,
  CModalFooter,
  CSpinner,
  CDataTable,
  CInput,
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import CIcon from "@coreui/icons-react";
import { SERVER_URL } from "src/config/config";

const LookupCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [textSearch, setTextSearch] = useState(null);
  const [listEmployee, setListEmployee] = useState([]);
  const [showModalDetailCus, setShowModalDetailCus] = useState(false);
  const [dataDetail, setDataImportMore] = useState({
    customerId: "", //Id khách hàng
    customerCode: "", //mã khách hàng
    customerName: "", //tên khách hàng
    avatar: "https://image.flaticon.com/icons/png/512/16/16410.png", //ảnh đại diện
    phoneNumber: "", //số điện thoại liên hệ
    address: "", //địa chỉ thường trú
    email: "", //địa chỉ email
    password: "", //mật khẩu
  });
  const areaId = localStorage.getItem("areaId");

  // Hàm lấy danh sách khách hàng ngoài khu vực theo tên khách hàng
  const getListEmployeeArea = async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}lookup/customers?areaId=${areaId}&customerName=${textSearch}`,
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
          setListEmployee(resData.data);
          setIsLoading(false);
          return;
        case 404:
          setListEmployee([]);
          setIsLoading(false);
          return;
        default:
          setListEmployee([]);
          setIsLoading(false);
          alert("Lỗi tìm kiếm khách hàng");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tìm kiếm khách hàng: ${err}`);
    }
  };

  // Hàm cập nhật lại khu vực cho khách hàng
  const updateAreaForCustomer = async () => {
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}area/customers`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            customerId: dataDetail.customerId,
            areaId: areaId,
          }),
        }
      );
      switch (response.status) {
        case 200:
          await getListEmployeeArea();
          setShowModalDetailCus(!showModalDetailCus);
          return;
        default:
          alert("Lỗi cập nhật khu vực cho khách hàng.");
          return;
      }
    } catch (err) {
      alert(`Lỗi cập nhật khu vực cho khách hàng: ${err}`);
    }
  };

  // Hàm xử lý khi click vào từng dòng để nhập thêm sản phẩm
  const handlerClickRow = (item) => {
    setDataImportMore({ ...dataDetail, ...item });
    setShowModalDetailCus(true);
  };

  // Modal hiển thị thông tin chi tiết khách hàng
  const InforCustomerModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalDetailCus}
        onClose={() => setShowModalDetailCus(!showModalDetailCus)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thông tin khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-4">
          {/* Ảnh minh họa sản phẩm */}
          <div className="d-flex justify-content-center">
            <CImg
              src={dataDetail.avatar}
              className="border"
              style={{ borderRadius: 15, width: "35%" }}
            />
          </div>
          {/* Thông tin khách hàng */}
          <div className="mt-4">
            {/* Tên khách hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-fastfood"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Tên khách hàng:</strong>
              </CCol>
              <CCol md="7">{dataDetail.customerName}</CCol>
            </CRow>
            {/* Mã khách hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-code" className="mr-2" color={COLORS.dark} />
                <strong>Mã khách hàng:</strong>
              </CCol>
              <CCol md="7">{dataDetail.customerCode}</CCol>
            </CRow>
            {/* Số điện thoại */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-featured-playlist"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số điện thoại:</strong>
              </CCol>
              <CCol md="7">{dataDetail.phoneNumber}</CCol>
            </CRow>
            {/* Số điện thoại khác */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-balance-scale"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số điện thoại khác:</strong>
              </CCol>
              <CCol md="7">{dataDetail.otherPhoneNumber ? dataDetail.otherPhoneNumber : "Không có"}</CCol>
            </CRow>
            {/* Email */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-house" className="mr-2" color={COLORS.dark} />
                <strong>Email:</strong>
              </CCol>
              <CCol md="7">{dataDetail.email}</CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter className="d-flex align-items-center justify-content-between">
          <CButton color="warning" shape="pill" onClick={updateAreaForCustomer} style={{color: COLORS.light}}>
            Cập nhật khu vực
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalDetailCus(!showModalDetailCus)}
          >
            Ok
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // header của trang
  const Header = () => {
    return (
      <>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div style={{ ...title }}>Tra cứu khách hàng ngoài khu vực</div>
        </CCardHeader>
      </>
    );
  };

  // Config các cột cho bảng dữ liệu
  const fields = [
    { key: "customerCode", label: "Mã KH", _style: { width: "10%" } },
    { key: "customerName", label: "Tên khách hàng", _style: { width: "20%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "20%" } },
    {
      key: "otherPhoneNumber",
      label: "Số điện thoại khác",
      _style: { width: "20%" },
    },
    { key: "address", label: "Địa chỉ", _style: { width: "30%" } },
  ];

  // Trường hợp chưa load được dữ liệu
  if (isLoading) {
    return (
      <>
        <CCard style={{ ...borderCustom }}>
          <Header />
          <CCardBody>
            <div className="d-flex justify-content-center align-items-center w-100 pt-5">
              <CSpinner color="info" />
            </div>
          </CCardBody>
        </CCard>
      </>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-end align-items-center mb-2">
        <CInput
          style={{ width: 300 }}
          className="mr-2"
          id="searchCus"
          type="text"
          placeholder="Nhập tên khách hàng cần tìm kiếm..."
          onChange={(event) => setTextSearch(event.target.value)}
        />
        <CButton color="primary" onClick={getListEmployeeArea} size="sm">
          <CIcon name="cil-search" size={"lg"} />
        </CButton>
      </div>
      <CCard style={{ ...borderCustom }}>
        <InforCustomerModal />
        <Header />
        <CCardBody>
          <CDataTable
            items={listEmployee}
            fields={fields}
            columnFilter
            tableFilter
            footer
            itemsPerPageSelect
            itemsPerPage={5}
            hover
            sorter
            pagination
            onRowClick={(item) => handlerClickRow(item)}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default LookupCustomer;
