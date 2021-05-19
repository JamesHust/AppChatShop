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
  CForm,
  CRow,
  CCol,
  CImg,
  CInputFile,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CModalFooter,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";
import ListEmployee from "./ListEmployee";
import COLORS from "src/constants/colors";

const Employees = () => {
  const [showModalAddAccount, setShowModalAddAccount] = useState(false);
  const [dataNewAccount, setDataNewAccount] = useState({
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
  });

  // Hàm xử lý hiển thị khi chọn ảnh mới
  const previewFile = () => {
    setDataNewAccount({
      ...dataNewAccount,
      avatar: "",
    });
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setDataNewAccount({
        ...dataNewAccount,
        avatar: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setDataNewAccount({
        ...dataNewAccount,
        avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
      });
    }
  };

  // Hàm gọi để xử lý chọn file ảnh
  const chooseImgHanler = () => {
    const imageFile = document.getElementById("imgProd");
    imageFile.click();
  };

  // Modal thêm mới nhân viên
  const ImportNewEmployeeModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalAddAccount}
        onClose={() => setShowModalAddAccount(!showModalAddAccount)}
        size="lg"
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thêm mới tài khoản nhân viên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu đại diện tài khoản */}
                <CImg
                  src={dataNewAccount.avatar}
                  className="border"
                  style={{ borderRadius: 15, width: "100%" }}
                />
                {/* Chọn ảnh từ máy */}
                <div className="w-100 d-flex justify-content-center mt-2">
                  <CButton
                    className="btn-pill mx-auto"
                    color="success"
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
                        defaultValue={dataNewAccount.adminName}
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
                        defaultValue={dataNewAccount.adminCode}
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
                        defaultValue={dataNewAccount.gender}
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
                        defaultValue={dataNewAccount.birthday}
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
                    defaultValue={dataNewAccount.homeTown}
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
                        defaultValue={dataNewAccount.phoneNumber}
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
                        defaultValue={dataNewAccount.password}
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
                    defaultValue={dataNewAccount.email}
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
                    defaultValue={dataNewAccount.address}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="mr-2"
            shape="pill"
            onClick={() => setShowModalAddAccount(!showModalAddAccount)}
          >
            Cập nhật
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalAddAccount(!showModalAddAccount)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <CCard style={{ ...borderCustom }}>
      <ImportNewEmployeeModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Quản lý nhân viên</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => setShowModalAddAccount(true)}
        >
          Thêm mới nhân viên
        </CButton>
      </CCardHeader>
      <CCardBody>
        <ListEmployee />
      </CCardBody>
    </CCard>
  );
};

export default Employees;
