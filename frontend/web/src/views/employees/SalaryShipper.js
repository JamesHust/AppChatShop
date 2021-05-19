import React, { useState } from "react";
import {
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImg,
  CRow,
  CCol,
  CButton,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const SalaryShipper = () => {
  const usersData = [
    {
      shipperId: "b7215975-0efb-4bf3-be8d-a710ca3e42b2",
      shipperCode: "038099002000",
      shipperName: "ThaoVan",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      phoneNumber: "0911088111",
      email: "tvan@gmail.com",
      address: "Cầu Giấy, Hà Nội",
      password: "1234567",
      chatId: "ccc8108b-5752-4ebc-a4d9-0b17181401f1",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      rating: "4",
      basicSalary: "1500000",
      bankId: "16707937",
      bankName: "ACB",
    },
    {
      shipperId: "d49d19bb-515a-4037-b3d6-8734bc24a99a",
      shipperCode: "038099112200",
      shipperName: "THưng",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      phoneNumber: "0977028052",
      email: "thung@gmail.com",
      address: "Cầu Giấy, Hà Nội",
      password: "123456",
      chatId: "5b6df969-94af-4b0f-9494-fe3441e4b978",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      rating: "4.9",
      basicSalary: "1500000",
      bankId: "167777249",
      bankName: "VIETCOMBANK",
    },
  ];
  const [dataSalaryShipper, setDataSalaryShipper] = useState({
    shipperId: "",
    shipperCode: "",
    shipperName: "",
    avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    chatId: "",
    shopId: "",
    rating: "0",
    basicSalary: "",
    bankId: "",
    bankName: "",
  });
  const [showModalSalary, setShowModalSalary] = useState(false);

  const fields = [
    { key: "shipperCode", label: "Mã Shipper/CCCD", _style: { width: "10%" } },
    { key: "shipperName", label: "Tên shipper", _style: { width: "20%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "10%" } },
    { key: "basicSalary", label: "Lương cứng", _style: { width: "15%" } },
  ];

  // Xử lý khi click từng hàng
  const handlerClickRow = (item) => {
    setDataSalaryShipper({
      ...dataSalaryShipper,
      ...item,
    });
    setShowModalSalary(true);
  };

  // Modal trả lương nhân viên
  const PaymentSalaryEmployeeModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalSalary}
        onClose={() => setShowModalSalary(!showModalSalary)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Trả lương shipper</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Ảnh đại diện shipper*/}
          <div className="d-flex justify-content-center">
            <CImg
              src={dataSalaryShipper.avatar}
              className="border"
              style={{ borderRadius: 15, width: "35%" }}
            />
          </div>
          {/* Thông tin shipper */}
          <div className="mt-4">
            {/* Tên shipper */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-user" className="mr-2" color={COLORS.dark} />
                <strong>Tên shipper:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.shipperName}</CCol>
            </CRow>
            {/* Mã shipper */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-code" className="mr-2" color={COLORS.dark} />
                <strong>Mã shipper/CMCD:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.shipperCode}</CCol>
            </CRow>
            {/* Số điện thoại */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-phone" className="mr-2" color={COLORS.dark} />
                <strong>Số điện thoại:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.phoneNumber}</CCol>
            </CRow>
            {/* Tiền lương cứng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-money" className="mr-2" color={COLORS.dark} />
                <strong>Tiền lương cứng:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.basicSalary}</CCol>
            </CRow>
            {/* Tên ngân hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-bank" className="mr-2" color={COLORS.dark} />
                <strong>Tên ngân hàng:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.bankName}</CCol>
            </CRow>
            {/* Số tài khoản ngân hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-dialpad"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số tài khoản:</strong>
              </CCol>
              <CCol md="7">{dataSalaryShipper.bankId}</CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="info"
            shape="pill"
            onClick={() => setShowModalSalary(!showModalSalary)}
          >
            Trả lương
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalSalary(!showModalSalary)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <>
      <PaymentSalaryEmployeeModal />
      <CDataTable
        items={usersData}
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
    </>
  );
};

export default SalaryShipper;
