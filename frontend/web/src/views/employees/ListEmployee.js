import React, { useState } from "react";
import {
  CButton,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CRow,
  CCol,
  CImg,
  CInputFile,
  CFormGroup,
  CLabel,
  CInput,
  CModalFooter,
  CSelect,
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const Employees = () => {
  const usersData = [
    {
      adminId: "b7215975-0efb-4bf3-be8d-a710ca3e42b2",
      adminCode: "038099002000",
      adminName: "ThaoVan",
      phoneNumber: "0911088111",
      email: "tvan@gmail.com",
      address: "Cầu Giấy, Hà Nội",
      password: "1234567",
      birthday: "1999-11-23",
      gender: 2,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "ccc8108b-5752-4ebc-a4d9-0b17181401f1",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
    },
    {
      adminId: "d49d19bb-515a-4037-b3d6-8734bc24a99a",
      adminCode: "038099112200",
      adminName: "THưng",
      phoneNumber: "0977028052",
      email: "thung@gmail.com",
      address: "Hai Bà Trưng, Hà Nội",
      password: "123456",
      birthday: "1999-12-8",
      gender: 1,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "5b6df969-94af-4b0f-9494-fe3441e4b978",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
    },
    {
      adminId: "e9441fbe-4138-47ba-bf04-477c01b0f3e7",
      adminCode: "038099002001",
      adminName: "BIGBOSS",
      phoneNumber: "0978785786",
      email: "bigboss@gmail.com",
      address: "Ba Đình, Hà Nội",
      password: "123456",
      birthday: "2000-5-17",
      gender: 1,
      homeTown: "Thị trấn Bến Sung, Như Thanh, Thanh Hóa",
      avatar:
        "https://i.pinimg.com/564x/97/03/53/970353e234af430a7cd7f3ebacdb7b96.jpg",
      chatId: "3766e5fc-6e5d-4a77-9b63-6aade98b62dd",
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
    },
  ];
  const [dataUpdateAccount, setDataUpdateAccount] = useState({
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
    avatar: "",
    chatId: "",
    shopId: "",
  });
  const [showModalUpdateAccount, setShowModalUpdateAccount] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  // Config các cột cho bảng dữ liệu
  const fields = [
    { key: "adminCode", label: "Mã NV/CCCD", _style: { width: "10%" } },
    { key: "adminName", label: "Tên nhân viên", _style: { width: "15%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "10%" } },
    { key: "address", label: "Địa chỉ", _style: { width: "30%" } },
    { key: "gender", label: "Giới tính", _style: { width: "10%" } },
    { key: "email", label: "Email", _style: { width: "15%" } },
    { key: "password", label: "Mật khẩu", _style: { width: "10%" } },
  ];

  // Hàm xử lý hiển thị khi chọn ảnh mới
  const previewFile = () => {
    setDataUpdateAccount({
      ...dataUpdateAccount,
      avatar: "",
    });
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setDataUpdateAccount({
        ...dataUpdateAccount,
        avatar: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setDataUpdateAccount({
        ...dataUpdateAccount,
        avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
      });
    }
  };

  // Hàm gọi để xử lý chọn file ảnh
  const chooseImgHanler = () => {
    const imageFile = document.getElementById("imgProd");
    imageFile.click();
  };

  // Hàm xử lý khi chọn 1 hàng
  const handlerClickRow = (item) => {
    setDataUpdateAccount({ ...dataUpdateAccount, ...item });
    setShowModalUpdateAccount(true);
  };

  // Modal cập nhật thông tin nhân viên
  const UpdateInfoEmployeeModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalUpdateAccount}
        onClose={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
        size="lg"
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin nhân viên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu đại diện tài khoản */}
                <CImg
                  src={dataUpdateAccount.avatar}
                  className="border"
                  style={{ borderRadius: 15, width: "100%" }}
                />
                {/* Chọn ảnh từ máy */}
                <div className="w-100 d-flex justify-content-center mt-2">
                  <CButton
                    className="btn-pill mx-auto"
                    color="warning"
                    onClick={chooseImgHanler}
                    variant="outline"
                  >
                    Chọn ảnh
                  </CButton>
                </div>
                <CInputFile
                  onChange={previewFile}
                  style={{ display: "none" }}
                  id="imgProd"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  <CCol>
                    {/* Tên nhân viên */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Tên nhân viên</CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        placeholder="Nhập tên nhân viên"
                        defaultValue={dataUpdateAccount.adminName}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Mã nhân viên */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-code">Mã sản phẩm</CLabel>
                      <CInput
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        type="text"
                        id="nf-code"
                        name="nf-code"
                        placeholder="Nhập mã sản phẩm"
                        defaultValue={dataUpdateAccount.adminCode}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/*Giới tính*/}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-gender">Giới tính</CLabel>
                      <CSelect
                        id="nf-gender"
                        name="nf-gender"
                        aria-label="Chọn giới tính"
                        defaultValue={dataUpdateAccount.gender}
                      >
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                        <option value="3">Khác</option>
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  {/* Ngày sinh */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-birthday">Ngày sinh</CLabel>
                      <CInput
                        type="date"
                        id="nf-birthday"
                        name="nf-birthday"
                        placeholder="Nhập ngày sinh"
                        defaultValue={dataUpdateAccount.birthday}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Quê quán */}
                <CFormGroup>
                  <CLabel htmlFor="nf-homeTown">Quê quán</CLabel>
                  <CInput
                    type="text"
                    id="nf-homeTown"
                    name="nf-homeTown"
                    placeholder="Nhập tên quê quán"
                    defaultValue={dataUpdateAccount.homeTown}
                  />
                </CFormGroup>
                <CRow>
                  {/* Số điện thoại */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-phone">Số điện thoại</CLabel>
                      <CInput
                        type="text"
                        id="nf-phone"
                        name="nf-phone"
                        placeholder="Nhập số điện thoại"
                        defaultValue={dataUpdateAccount.phoneNumber}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Mật khẩu */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-pass">Mật khẩu</CLabel>
                      <CInput
                        type="text"
                        id="nf-pass"
                        name="nf-pass"
                        placeholder="Nhập mật khẩu"
                        defaultValue={dataUpdateAccount.password}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Email */}
                <CFormGroup>
                  <CLabel htmlFor="nf-email">Email</CLabel>
                  <CInput
                    type="email"
                    id="nf-email"
                    name="nf-email"
                    placeholder="Nhập email"
                    defaultValue={dataUpdateAccount.email}
                  />
                </CFormGroup>
                {/* Địa chỉ */}
                <CFormGroup>
                  <CLabel htmlFor="nf-address">Địa chỉ</CLabel>
                  <CInput
                    type="text"
                    id="nf-address"
                    name="nf-address"
                    placeholder="Nhập địa chỉ"
                    defaultValue={dataUpdateAccount.address}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex align-items-center justify-content-between">
          <CButton
            color="danger"
            shape="pill"
            className="d-flex align-items-center"
            onClick={() => {
              setShowModalUpdateAccount(false);
              setShowModalConfirm(true);
            }}
          >
            Xóa tài khoản
          </CButton>
          <div>
            <CButton
              color="warning"
              className="mr-2"
              style={{ color: COLORS.light }}
              shape="pill"
              onClick={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
            >
              Cập nhật
            </CButton>
            <CButton
              color="secondary"
              shape="pill"
              onClick={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
            >
              Hủy
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    );
  };
  
  // Modal xác nhận xóa
  const ConfirmDeleteModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalConfirm}
        onClose={() => setShowModalConfirm(!showModalConfirm)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Bạn xác nhận muốn xóa tài khoản của nhân viên này?
        </CModalBody>
        <CModalFooter>
          <CButton
            color="info"
            shape="pill"
            className="d-flex align-items-center"
            onClick={() => console.log("test")}
          >
            Tiếp tục
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalConfirm(!showModalConfirm)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <>
      <UpdateInfoEmployeeModal />
      <ConfirmDeleteModal />
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

export default Employees;
