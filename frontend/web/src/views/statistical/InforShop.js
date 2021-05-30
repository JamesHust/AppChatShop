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
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import COLORS from "../../constants/colors";
import { borderCustom } from "../../constants/common";

// Thông tin cửa hàng
const InforShop = ({ data, reload }) => {
  const [showModalUpdateShop, setShowModalUpdateShop] = useState(false);
  // Modal cập nhật thông tin cửa hàng
  const UpdateInfoShopModal = () => {
    const [infoShop, setInfoShop] = useState({
      shopId: data.shopId,
      shopCode: data.shopCode,
      shopName: "",
      avatar: data.avatar,
      phoneNumber: "",
      otherPhoneNumber: "",
      address: "",
      email: "",
      openTime: "",
      closeTime: "",
      rating: 0.0,
      chatId: "",
    });
    const [validText, setValidText] = useState("");

    // hàm check validate cho form cập nhật thông tin cửa hàng
    const checkValidForm = () => {
      const file = document.querySelector("input[type=file]").files[0];
      if (
        infoShop.shopName ||
        infoShop.phoneNumber ||
        infoShop.otherPhoneNumber ||
        infoShop.address ||
        infoShop.email ||
        infoShop.openTime ||
        infoShop.openTime === "00:00" ||
        infoShop.closeTime ||
        infoShop.closeTime === "00:00" ||
        file
      ) {
        const shopName = document.getElementById("nf-name").value;
        const phoneNumber = document.getElementById("nf-phone").value;
        const address = document.getElementById("nf-address").value;
        const email = document.getElementById("nf-email").value;
        const openTime = document.getElementById("nf-openTime").value;
        const closeTime = document.getElementById("nf-closeTime").value;
        if (
          shopName &&
          phoneNumber &&
          address &&
          email &&
          openTime &&
          openTime !== "00:00" &&
          closeTime &&
          closeTime !== "00:00"
        ) {
          setValidText("");
          return true;
        } else {
          setValidText(
            "Không được để trống các trường bắt buộc. Vui lòng nhập đầy đủ."
          );
          return false;
        }
      } else {
        setValidText("Bạn chưa thực sự thay đổi thông tin cửa hàng.");
        return false;
      }
    };

    // Hàm xử lý cập nhật thông tin shop
    const handlerUpdateInfoShop = async () => {
      if (checkValidForm()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector("input[type=file]");
          formData.append("file", productImage.files[0]);
          formData.append(
            "shop",
            JSON.stringify({
              shopId: data.shopId,
              shopName: infoShop.shopName,
              phoneNumber: infoShop.phoneNumber,
              otherPhoneNumber: infoShop.otherPhoneNumber,
              address: infoShop.address,
              email: infoShop.email,
              openTime: infoShop.openTime,
              closeTime: infoShop.closeTime,
            })
          );
          const response = await fetch(`http://192.168.1.125:3000/api/shops`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "x-access-token": token,
            },
            body: formData,
          });
          switch (response.status) {
            case 200:
              await reload();
              setShowModalUpdateShop(!showModalUpdateShop);
              return;
            default:
              alert("Lỗi không cập nhật được thông tin cửa hàng");
              return;
          }
        } catch (err) {
          alert(`Lỗi tải dữ liệu: ${err}`);
        }
      }
    };
    // Hàm xử lý hiển thị khi chọn file
    const previewFile = () => {
      setInfoShop({ ...infoShop, avatar: "" });
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setInfoShop({ ...infoShop, avatar: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setInfoShop({
          ...infoShop,
          avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
        });
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
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin cửa hàng</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-5">
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh đại diện - thương hiệu cửa hàng */}
                <CImg
                  src={infoShop.avatar}
                  className="border"
                  style={{ borderRadius: 15, width: "100%" }}
                />
                {/* Chọn ảnh từ máy */}
                <div className="w-100 d-flex justify-content-center mt-2">
                  <CButton
                    className="btn-pill mx-auto"
                    style={{ height: 35 }}
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
                  {/* Mã CH */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-code">
                          Mã cửa hàng <span className="text-danger">(*)</span>
                        </CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="text"
                          id="nf-code"
                          name="nf-code"
                          defaultValue={data.shopCode}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                  {/* Tên cửa hàng */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">
                        Tên cửa hàng <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        defaultValue={data.shopName}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            shopName: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Số điện thoại */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-phone">
                        Số điện thoại <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        id="nf-phone"
                        name="nf-phone"
                        defaultValue={data.phoneNumber}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            phoneNumber: event.target.value,
                          })
                        }
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
                        type="number"
                        id="nf-otherPhone"
                        name="nf-otherPhone"
                        defaultValue={data.otherPhoneNumber}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            otherPhoneNumber: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CFormGroup>
                  <CLabel htmlFor="nf-address">
                    Địa chỉ <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-address"
                    name="nf-address"
                    defaultValue={data.address}
                    onChange={(event) =>
                      setInfoShop({ ...infoShop, address: event.target.value })
                    }
                  />
                </CFormGroup>
                <CRow>
                  {/* Email */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-email">
                        Email <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="email"
                        id="nf-email"
                        name="nf-email"
                        defaultValue={data.email}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            email: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Rating */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-rating">Đánh giá</CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="text"
                          id="nf-rating"
                          name="nf-rating"
                          defaultValue={Math.round(data.rating * 100) / 100}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Thời gian mở cửa */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-openTime">
                        Mở cửa lúc <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="time"
                        id="nf-openTime"
                        name="nf-openTime"
                        defaultValue={data.openTime}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            openTime: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Thời gian đóng cửa */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-closeTime">
                        Đóng cửa lúc <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="time"
                        id="nf-closeTime"
                        name="nf-closeTime"
                        defaultValue={data.closeTime}
                        onChange={(event) =>
                          setInfoShop({
                            ...infoShop,
                            closeTime: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CForm>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 215,
              color: "red",
              width: "82%",
            }}
          >
            {validText}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="warning"
            style={{ color: COLORS.light }}
            shape="pill"
            onClick={handlerUpdateInfoShop}
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
                src={data.avatar}
                width="100%"
                className="border"
                style={{ borderRadius: 15 }}
              />
            </CCol>
            <CCol md="7">
              {/* Tên cửa hàng */}
              <CRow>
                <h4 style={{ paddingLeft: 10 }}>{data.shopName}</h4>
              </CRow>
              {/* Mã cửa hàng */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-barcode" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.shopCode}
                </CCol>
              </CRow>
              {/* Số điện thoại */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-phone" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.phoneNumber}
                </CCol>
              </CRow>
              {/* Số điện thoại khác */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-screen-smartphone" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.otherPhoneNumber}
                </CCol>
              </CRow>
              {/* Địa chỉ */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-address-book" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.address}
                </CCol>
              </CRow>
              {/* Email */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-envelope-closed" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.email}
                </CCol>
              </CRow>
              {/* Thời gian mở cửa */}
              <CRow style={{ marginBottom: 5 }}>
                <CCol md="2">
                  <CIcon name="cil-clock" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.openTime}
                </CCol>
              </CRow>
              {/* Thời gian đóng cửa */}
              <CRow>
                <CCol md="2">
                  <CIcon name="cil-clock" />
                </CCol>
                <CCol md="10" style={{ color: COLORS.dark, paddingTop: 2 }}>
                  {data.closeTime}
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
