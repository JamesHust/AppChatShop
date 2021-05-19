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

const SalaryEmployee = () => {
  const usersData = [
    {
      adminId: "b7215975-0efb-4bf3-be8d-a710ca3e42b2",
      adminCode: "038099002000",
      adminName: "ThaoVan",
      phoneNumber: "0911088111",
      email: "tvan@gmail.com",
      address: "Cầu Giấy, Hà Nội",
      password: "1234567",
      birthday: "23/11/1999",
      gender: 2,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "ccc8108b-5752-4ebc-a4d9-0b17181401f1",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      type: 2,
      workingHours: 40,
      bankId: "16707937",
      bankName: "ACB",
    },
    {
      adminId: "d49d19bb-515a-4037-b3d6-8734bc24a99a",
      adminCode: "038099112200",
      adminName: "THưng",
      phoneNumber: "0977028052",
      email: "thung@gmail.com",
      address: "Hai Bà Trưng, Hà Nội",
      password: "123456",
      birthday: "8/12/1999",
      gender: 1,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "5b6df969-94af-4b0f-9494-fe3441e4b978",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      type: 2,
      workingHours: 40,
      bankId: "167777249",
      bankName: "VIETCOMBANK",
    },
    {
      adminId: "e9441fbe-4138-47ba-bf04-477c01b0f3e7",
      adminCode: "038099002001",
      adminName: "BIGBOSS",
      phoneNumber: "0978785786",
      email: "bigboss@gmail.com",
      address: "Ba Đình, Hà Nội",
      password: "123456",
      birthday: "7/5/2000",
      gender: 1,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "3766e5fc-6e5d-4a77-9b63-6aade98b62dd",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      type: 1,
      workingHours: 15,
      bankId: "199553224",
      bankName: "AGRIBANK",
    },
  ];
  const [dataSalaryEmployee, setDataSalaryEmployee] = useState({
    adminId: "",
    adminCode: "",
    adminName: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    birthday: "",
    gender: 0,
    homeTown: "",
    avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
    chatId: "",
    shopId: "",
    type: 0,
    workingHours: 0,
    bankId: "",
    bankName: "",
  });
  const [showModalSalary, setShowModalSalary] = useState(false);

  const fields = [
    { key: "adminCode", label: "Mã NV/CCCD", _style: { width: "10%" } },
    { key: "adminName", label: "Tên nhân viên", _style: { width: "20%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "10%" } },
    { key: "gender", label: "Giới tính", _style: { width: "10%" } },
    { key: "type", label: "Loại hình", _style: { width: "15%" } },
    { key: "workingHours", label: "Thời gian làm", _style: { width: "15%" } },
    { key: "salary", label: "Tiền công", _style: { width: "15%" } },
  ];

  // Lấy tên loại hình làm việc
  const getType = (type) => {
    switch (type) {
      case 1:
        return "Bán thời gian";
      case 2:
        return "Toàn thời gian";
      default:
        return "Chưa xác định";
    }
  };

  // Lấy tên giới tính
  const getGender = (type) => {
    switch (type) {
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      case 3:
        return "Khác";
      default:
        return "Chưa xác định";
    }
  };

  // tính tiền công
  const countSalary = (timeWork) => {
    return +timeWork * 300000;
  };

  // Xử lý khi click từng hàng
  const handlerClickRow = (item) => {
    setDataSalaryEmployee({
      ...dataSalaryEmployee,
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
          <CModalTitle>Trả lương nhân viên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Ảnh đại diện nhân viên*/}
          <div className="d-flex justify-content-center">
            <CImg
              src={dataSalaryEmployee.avatar}
              className="border"
              style={{ borderRadius: 15, width: "35%" }}
            />
          </div>
          {/* Thông tin nhân viên */}
          <div className="mt-4">
            {/* Tên nhân viên */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-user" className="mr-2" color={COLORS.dark} />
                <strong>Tên nhân viên:</strong>
              </CCol>
              <CCol md="7">{dataSalaryEmployee.adminName}</CCol>
            </CRow>
            {/* Mã nhân viên */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-code" className="mr-2" color={COLORS.dark} />
                <strong>Mã nhân viên/CMCD:</strong>
              </CCol>
              <CCol md="7">{dataSalaryEmployee.adminCode}</CCol>
            </CRow>
            {/* Giới tính */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-wc" className="mr-2" color={COLORS.dark} />
                <strong>Giới tính:</strong>
              </CCol>
              <CCol md="7">{getGender(dataSalaryEmployee.gender)}</CCol>
            </CRow>
            {/* Số điện thoại */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-phone" className="mr-2" color={COLORS.dark} />
                <strong>Số điện thoại:</strong>
              </CCol>
              <CCol md="7">{dataSalaryEmployee.phoneNumber}</CCol>
            </CRow>
            {/* Loại hình làm */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-clock" className="mr-2" color={COLORS.dark} />
                <strong>Loại hình làm:</strong>
              </CCol>
              <CCol md="7">{getType(dataSalaryEmployee.type)}</CCol>
            </CRow>
            {/* Số giờ làm */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-av-timer"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số giờ làm:</strong>
              </CCol>
              <CCol md="7">{dataSalaryEmployee.workingHours}</CCol>
            </CRow>
            {/* Tiền lương tháng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-money" className="mr-2" color={COLORS.dark} />
                <strong>Tiền lương tháng:</strong>
              </CCol>
              <CCol md="7">{+dataSalaryEmployee.workingHours * 35000}</CCol>
            </CRow>
            {/* Tên ngân hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-bank" className="mr-2" color={COLORS.dark} />
                <strong>Tên ngân hàng:</strong>
              </CCol>
              <CCol md="7">{dataSalaryEmployee.bankName}</CCol>
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
              <CCol md="7">{dataSalaryEmployee.bankId}</CCol>
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
        scopedSlots={{
          type: (item) => (
            <td>
              <div>{getType(item.type)}</div>
            </td>
          ),
          gender: (item) => (
            <td>
              <div>{getGender(item.gender)}</div>
            </td>
          ),
          salary: (item) => (
            <td>
              <div>{countSalary(item.workingHours)}</div>
            </td>
          ),
        }}
      />
    </>
  );
};

export default SalaryEmployee;
