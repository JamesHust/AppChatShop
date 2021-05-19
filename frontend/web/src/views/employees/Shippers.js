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
  CModalFooter,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";
import ListShipper from "./ListShipper";
import COLORS from "src/constants/colors";

const Shippers = () => {
  const [showModalAddAccount, setShowModalAddAccount] = useState(false);
  const [dataNewAccount, setDataNewAccount] = useState({
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
  const ImportNewShipperModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalAddAccount}
        onClose={() => setShowModalAddAccount(!showModalAddAccount)}
        size="lg"
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thêm shipper mới</CModalTitle>
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
                    {/* Tên shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Tên shipper</CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        placeholder="Nhập tên nhân viên"
                        defaultValue={dataNewAccount.shipperName}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Mã shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-code">Mã shipper/CMND</CLabel>
                      <CInput
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        type="text"
                        id="nf-code"
                        name="nf-code"
                        placeholder="Nhập mã sản phẩm"
                        defaultValue={dataNewAccount.shipperCode}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
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
                  <CCol>
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
                  </CCol>
                </CRow>
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
            Thêm mới
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
      <ImportNewShipperModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Danh sách nhân viên giao hàng</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => setShowModalAddAccount(true)}
        >
          Thêm shipper mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <ListShipper />
      </CCardBody>
    </CCard>
  );
};

export default Shippers;
