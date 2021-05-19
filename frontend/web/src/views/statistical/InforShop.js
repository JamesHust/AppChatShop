import React, { useState } from "react";
import {
  CRow,
  CCol,
  CImg,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CButton,
  CModalFooter,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CInputFile,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import COLORS from "../../constants/colors";
import { borderCustom } from "../../constants/common";

// Thông tin cửa hàng
const InforShop = () => {
  const [showModalUpdateShop, setShowModalUpdateShop] = useState(false);
  const [fileImage, setFileImage] = useState(
    "https://i.pinimg.com/564x/a6/93/de/a693deeb3c809a0786e98b7f19421829.jpg"
  );

  // Modal cập nhật thông tin cửa hàng
  const UpdateInfoShopModal = () => {
    // Hàm xử lý hiển thị khi chọn file
    const previewFile = () => {
      setFileImage("");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setFileImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setFileImage("https://image.flaticon.com/icons/png/512/16/16410.png");
      }
    };

    // Hàm gọi để xử lý chọn file ảnh
    const chooseImgHanler = () => {
      const imageFile = document.getElementById("imgProd");
      imageFile.click();
    };
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalUpdateShop}
        onClose={() => setShowModalUpdateShop(!showModalUpdateShop)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin cửa hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh đại diện - thương hiệu cửa hàng */}
                <CImg
                  src={fileImage}
                  className="border"
                  style={{ borderRadius: 15, width: "100%" }}
                />
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
                <CRow>
                  {/* Mã CH */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-code">Mã CH</CLabel>
                      <CInput
                        type="text"
                        id="nf-code"
                        name="nf-code"
                        defaultValue="BKSHOP"
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Tên cửa hàng */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Tên cửa hàng</CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        defaultValue="BKShop"
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
                        defaultValue="0966073028"
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Số điện thoại khác */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-otherPhone">
                        Số điện thoại khác
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-otherPhone"
                        name="nf-otherPhone"
                        defaultValue="0911264086"
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CFormGroup>
                  <CLabel htmlFor="nf-address">Địa chỉ</CLabel>
                  <CInput
                    type="text"
                    id="nf-address"
                    name="nf-address"
                    defaultValue="22 ngách 20, Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội"
                  />
                </CFormGroup>
                <CRow>
                  {/* Email */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-email">Email</CLabel>
                      <CInput
                        type="email"
                        id="nf-email"
                        name="nf-email"
                        defaultValue="hungjame99@gmail.com"
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Rating */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-rating">Đánh giá</CLabel>
                      <CInput
                        disabled
                        type="text"
                        id="nf-rating"
                        name="nf-rating"
                        defaultValue="4.9"
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Thời gian mở cửa */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-opneTime">Mở cửa lúc</CLabel>
                      <CInput
                        type="text"
                        id="nf-opneTime"
                        name="nf-opneTime"
                        defaultValue="08:00 AM"
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Thời gian đóng cửa */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-closeTime">Đóng cửa lúc</CLabel>
                      <CInput
                        type="text"
                        id="nf-closeTime"
                        name="nf-closeTime"
                        defaultValue="09:00 PM"
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
            color="primary"
            shape="pill"
            onClick={() => setShowModalUpdateShop(!showModalUpdateShop)}
          >
            Cập nhật
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalUpdateShop(!showModalUpdateShop)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };
  return (
    <>
      <CCard style={{ ...borderCustom }}>
        <CCardHeader style={{ fontWeight: "bold", fontSize: 18 }}>
          Thông tin cửa hàng
        </CCardHeader>
        <CCardBody>
          <CRow>
            {/* Ảnh đại diện - thương hiệu cửa hàng */}
            <CCol md="5">
              <CImg
                src="https://i.pinimg.com/564x/a6/93/de/a693deeb3c809a0786e98b7f19421829.jpg"
                width="100%"
                className="border"
                style={{ borderRadius: 15 }}
              />
            </CCol>
            <CCol md="7">
              {/* Tên cửa hàng */}
              <CRow>
                <h4 style={{ paddingLeft: 10 }}>BKShop</h4>
              </CRow>
              {/* Mã cửa hàng */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-barcode" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  BKSHOP
                </CCol>
              </CRow>
              {/* Số điện thoại */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-phone" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  0966073028
                </CCol>
              </CRow>
              {/* Số điện thoại khác */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-screen-smartphone" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  0773288995
                </CCol>
              </CRow>
              {/* Địa chỉ */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-address-book" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  22 ngách 20 Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội
                </CCol>
              </CRow>
              {/* Email */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-envelope-closed" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  hungjame99@gmail.com
                </CCol>
              </CRow>
              {/* Thời gian mở cửa */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-clock" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  08:00 AM
                </CCol>
              </CRow>
              {/* Thời gian đóng cửa */}
              <CRow>
                <CCol md="2">
                  <CIcon name="cil-clock" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  09:00 PM
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <UpdateInfoShopModal showModal={showModalUpdateShop} />
          <CButton
            block
            active
            shape="pill"
            variant="ghost"
            style={{
              backgroundColor: COLORS.light_blue_4,
              color: COLORS.light,
            }}
            aria-pressed="true"
            onClick={() => {
              setShowModalUpdateShop(true);
            }}
          >
            Cập nhật
          </CButton>
        </CCardFooter>
      </CCard>
    </>
  );
};

export default InforShop;
