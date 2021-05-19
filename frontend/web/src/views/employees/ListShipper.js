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
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const ListShipper = () => {
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
    },
  ];
  const [dataUpdateAccount, setDataUpdateAccount] = useState({
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
  });
  const [showModalUpdateAccount, setShowModalUpdateAccount] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  // Config các cột cho bảng dữ liệu
  const fields = [
    { key: "shipperCode", label: "Mã shipper/CCCD", _style: { width: "10%" } },
    { key: "shipperName", label: "Tên shipper", _style: { width: "15%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "10%" } },
    { key: "address", label: "Địa chỉ", _style: { width: "40%" } },
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

  // Modal cập nhật thông tin sản phẩm
  const UpdateInfoShipperModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalUpdateAccount}
        onClose={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
        size="lg"
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin shipper</CModalTitle>
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
                    {/* Tên shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Tên shipper</CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        placeholder="Nhập tên shipper"
                        defaultValue={dataUpdateAccount.shipperName}
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
                        placeholder="Nhập mã shipper"
                        defaultValue={dataUpdateAccount.shipperCode}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
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
                  </CCol>
                  <CCol>
                    {/* Đánh giá */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-rating">Đánh giá</CLabel>
                      <CInput
                        type="text"
                        id="nf-rating"
                        name="nf-rating"
                        placeholder="Đánh giá"
                        defaultValue={dataUpdateAccount.rating}
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
      <UpdateInfoShipperModal />
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

export default ListShipper;
