import React, { useState } from "react";
import {
  CButton,
  CInput,
  CLabel,
  CForm,
  CFormGroup,
  CCol,
  CImg,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CInputFile
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const Account = () => {
  const [dataPass, setDataPass] = useState({
    oldPass: "",
    reOldPass: "",
    newPass: "",
  });
  const [account, setAccount] = useState({
    avatar:
      "https://scontent-hkg4-2.xx.fbcdn.net/v/t1.6435-9/119774014_1575128779362223_150505934135233007_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=mkNBwQ1OpikAX9HGTUW&_nc_ht=scontent-hkg4-2.xx&oh=4644d61c3c5cf125432dcaee35e27ec9&oe=60C7F31A",
    adminCode: "038099002000",
    adminName: "Mai Thế Hưng",
    phoneNumber: "0966073028",
    email: "hungjame99@gmail.com",
    address: "22 ngách 20 Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội",
    homeTown: "Hải Vân, Như Thanh, Thanh Hóa",
    gender: 1,
    birthday: "08/12/1999",
    password: "123456",
  });
  const [showModalChangePass, setShowModalChangePass] = useState(false);

  // Hàm xử lý hiển thị ảnh demo khi chọn ảnh ms
  const previewFile = () => {
    setAccount({
      ...account,
      avatar: "",
    });
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setAccount({
        ...account,
        avatar: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setAccount({
        ...account,
        avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
      });
    }
  };

  // Hàm gọi để xử lý chọn file ảnh
  const chooseImgHanler = () => {
    const imageFile = document.getElementById("imgProd");
    imageFile.click();
  };

  // Hàm lấy tên giới tính
  const getGender = (numGender) => {
    switch (numGender) {
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      case 3:
        return "Khác";
      default:
        return "Không xác định";
    }
  };

  // Hàm xử lý khi click vào nút thay đổi mật khẩu
  const handlerClickChangePass = () => {
    console.log("ok");
    setDataPass({
      ...dataPass,
      oldPass: "",
      reOldPass: "",
      newPass: "",
    });
    setShowModalChangePass(true);
  };

  // Modal thay đổi mật khẩu
  const ChangePasswordModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalChangePass}
        onClose={() => setShowModalChangePass(!showModalChangePass)}
        size="sm"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thay đổi mật khẩu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-amountImport">Mật khẩu cũ</CLabel>
              <CInput
                type="text"
                id="nf-oldPass"
                name="nf-oldPass"
                placeholder="Nhập mật khẩu cũ"
                defaultValue={dataPass.oldPass}
              />
            </CFormGroup>
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-amountImport">Nhập lại mật khẩu cũ</CLabel>
              <CInput
                type="number"
                id="nf-amountImport"
                name="nf-amountImport"
                placeholder="Nhập lại mật khẩu cũ"
                defaultValue={dataPass.reOldPass}
              />
            </CFormGroup>
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-amountImport">Mật khẩu mới</CLabel>
              <CInput
                type="number"
                id="nf-amountImport"
                name="nf-amountImport"
                placeholder="Nhập mật khẩu mới"
                defaultValue={dataPass.newPass}
              />
            </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="warning"
            style={{ color: COLORS.light }}
            shape="pill"
            onClick={() => setShowModalChangePass(!showModalChangePass)}
          >
            Cập nhật
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalChangePass(!showModalChangePass)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <CCard style={{ ...borderCustom }}>
      <ChangePasswordModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Quản lý tài khoản</div>
        <CButton
          color="warning"
          style={{ color: COLORS.light }}
          shape="pill"
          onClick={handlerClickChangePass}
        >
          Thay đổi mật khẩu
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CForm action="" method="post">
          <CRow>
            <CCol md="3">
              {/* Ảnh đại diện*/}
              <div className="w-100 d-flex justify-content-center">
                <CImg
                  src={account.avatar}
                  className="border"
                  style={{ padding: 10, borderRadius: 15 }}
                  width="90%"
                  height={331}
                />
              </div>
              {/* Chọn ảnh từ máy */}
              <div className="w-100 d-flex justify-content-center mt-2">
                <CButton
                  className="btn-pill mx-auto"
                  color="info"
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
              {/* Mã nhân viên/CMND */}
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-code">Mã quản trị/CMND</CLabel>
                    <CInput
                      type="text"
                      id="nf-code"
                      name="nf-code"
                      defaultValue={account.adminCode}
                    />
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-name">Tên quản trị viên</CLabel>
                    <CInput
                      type="text"
                      id="nf-name"
                      name="nf-name"
                      defaultValue={account.adminName}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              {/* Ngày sinh và Giới tính */}
              <CRow>
                {/* Ngày sinh */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-birthday">Ngày sinh</CLabel>
                    <CInput
                      type="text"
                      id="nf-birthday"
                      name="nf-birthday"
                      defaultValue={account.birthday}
                    />
                  </CFormGroup>
                </CCol>
                {/* Giới tính */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-gender">Giới tính</CLabel>
                    <CInput
                      type="text"
                      id="nf-gender"
                      name="nf-gender"
                      defaultValue={getGender(account.gender)}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              {/* Số điện thoại và Email*/}
              <CRow>
                {/* Số điện thoại */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-phone">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      id="nf-phone"
                      name="nf-phone"
                      defaultValue={account.phoneNumber}
                    />
                  </CFormGroup>
                </CCol>
                {/* Email */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Email</CLabel>
                    <CInput
                      type="email"
                      id="nf-email"
                      name="nf-email"
                      defaultValue={account.email}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              {/* Địa chỉ hiện tại */}
              <CFormGroup>
                <CLabel htmlFor="nf-address">Địa chỉ hiện tại</CLabel>
                <CInput
                  type="text"
                  id="nf-address"
                  name="nf-address"
                  defaultValue={account.address}
                />
              </CFormGroup>
              {/* Quê quán */}
              <CFormGroup>
                <CLabel htmlFor="nf-homeTown">Quê quán</CLabel>
                <CInput
                  type="text"
                  id="nf-homeTown"
                  name="nf-homeTown"
                  defaultValue={account.homeTown}
                />
              </CFormGroup>
              <div className="d-flex justify-content-end mt-5">
                <CButton
                  color="warning"
                  style={{ color: COLORS.light }}
                  shape="pill"
                  onClick={() => {}}
                >
                  Cập nhật
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Account;
