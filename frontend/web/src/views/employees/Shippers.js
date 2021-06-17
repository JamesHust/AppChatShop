import React, { useState, useRef } from "react";
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
import { useSelector } from "react-redux";
import { SERVER_URL } from "src/config/config";

const Shippers = () => {
  const [showModalAddAccount, setShowModalAddAccount] = useState(false);
  const childRef = useRef();
  const admin = useSelector((state) => state.authReducer.admin);

  // hàm xử lý khi chọn thêm shipper
  const handlerOnClickAdd = () => {
    setShowModalAddAccount(true);
  };

  // Modal thêm mới nhân viên
  const ImportNewShipperModal = () => {
    const [dataNewAccount, setDataNewAccount] = useState({
      shipperId: "",
      shipperCode: "",
      shipperName: "",
      avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      basicSalary: "",
      chatId: "",
      shopId: admin.shopId,
    });
    const [validTextImportNew, setValidTextImportNew] = useState("");

    // reset lại dữ liệu khi đóng form
    const resetData = () => {
      document.getElementById("imgShipperNew").value = "";
      setDataNewAccount({
        shipperId: "",
        shipperCode: "",
        shipperName: "",
        avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
        phoneNumber: "",
        email: "",
        address: "",
        password: "",
        basicSalary: "",
        chatId: "",
        shopId: admin.shopId,
      });
    };

    // Hàm check validate form
    const checkValidImportNew = () => {
      var file = document.querySelector("input[id='imgShipperNew']").files[0];
      if (file) {
        const shipperName = document.getElementById("nf-nameNew").value;
        const shipperCode = document.getElementById("nf-idCardCodeNew").value;
        const email = document.getElementById("nf-emailNew").value;
        const phoneNumber = document.getElementById("nf-phoneNew").value;
        const password = document.getElementById("nf-passNew").value;
        const basicSalary = document.getElementById("nf-basicSalaryNew").value;
        const address = document.getElementById("nf-addressNew").value;
        if (
          shipperName &&
          shipperCode &&
          basicSalary &&
          phoneNumber &&
          password &&
          email &&
          address
        ) {
          // Validate mật khẩu
          const regexPass =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!regexPass.test(password)) {
            setValidTextImportNew(
              "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một ký tự và một số."
            );
            return false;
          }
          // Validate cho email
          const regexEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!regexEmail.test(email)) {
            setValidTextImportNew(
              "Email không đúng định dạng. Vui lòng nhập lại."
            );
            return false;
          }
          // Validate cho CMND
          if (shipperCode.length !== 12) {
            setValidTextImportNew(
              "Mã căn cước/chứng minh nhân dân phải gồm 12 số."
            );
            return false;
          }
          // Validate cho số điện thoại
          const regexPhone = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;
          if (!regexPhone.test(phoneNumber)) {
            setValidTextImportNew("Số điện thoại không hợp lệ.");
            return false;
          }
          setValidTextImportNew("");
          return true;
        } else {
          setValidTextImportNew(
            "Các trường bắt buộc không được phép để trống. Vui lòng nhập đầy đủ."
          );
          return false;
        }
      } else {
        setValidTextImportNew("Vui lòng chọn ảnh đại diện.");
        return false;
      }
    };

    // hàm xử lý thêm shipper mới
    const handlerInsertNew = async () => {
      if (checkValidImportNew()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector(
            "input[id='imgShipperNew']"
          );
          formData.append("file", productImage.files[0]);
          formData.append(
            "shipper",
            JSON.stringify({
              shipperName: document.getElementById("nf-nameNew").value,
              shipperCode: document.getElementById("nf-idCardCodeNew").value,
              email: document.getElementById("nf-emailNew").value,
              phoneNumber: document.getElementById("nf-phoneNew").value,
              password: document.getElementById("nf-passNew").value,
              basicSalary: document.getElementById("nf-basicSalaryNew").value,
              address: document.getElementById("nf-addressNew").value,
              roleAction: admin.role,
              shopId: admin.shopId
            })
          );
          const response = await fetch(`${SERVER_URL}shippers`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "x-access-token": token,
            },
            body: formData,
          });
          switch (response.status) {
            case 200:
              childRef.current.reload();
              setShowModalAddAccount(!showModalAddAccount);
              return;
            case 401:
              alert("Bạn không có quyền thực hiện hành động này.");
              setShowModalAddAccount(!showModalAddAccount);
              return;
            case 403:
              setValidTextImportNew(
                "Email hoặc Số điện thoại hoặc Mã CCCD/CMND đã bị trùng."
              );
              return;
            default:
              alert("Lỗi không cập nhật được thông tin sản phẩm");
              return;
          }
        } catch (err) {
          alert(`Lỗi tải dữ liệu: ${err}`);
        }
      }
    };

    // Hàm xử lý hiển thị khi chọn ảnh mới
    const previewFile = () => {
      setDataNewAccount({
        ...dataNewAccount,
        avatar: "",
      });
      var file = document.querySelector("input[id='imgShipperNew']").files[0];
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
      const imageFile = document.getElementById("imgShipperNew");
      imageFile.click();
    };

    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalAddAccount}
        onClose={() => {
          setShowModalAddAccount(!showModalAddAccount);
          resetData();
        }}
        size="lg"
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thêm shipper mới</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-5">
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
                  id="imgShipperNew"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  <CCol>
                    {/* Tên shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-nameNew">
                        Tên shipper <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-nameNew"
                        name="nf-nameNew"
                        placeholder="Nhập tên shipper"
                        defaultValue={dataNewAccount.shipperName}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Mã shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-idCardCodeNew">
                        Mã shipper/CMND <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        id="nf-idCardCodeNew"
                        name="nf-idCardCodeNew"
                        placeholder="Nhập mã shipper/CMND"
                        defaultValue={dataNewAccount.shipperCode}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    {/* Email */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-emailNew">
                        Email <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="email"
                        id="nf-emailNew"
                        name="nf-emailNew"
                        placeholder="Nhập email"
                        defaultValue={dataNewAccount.email}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Số điện thoại */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-phoneNew">
                        Số điện thoại <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        id="nf-phoneNew"
                        name="nf-phoneNew"
                        placeholder="Nhập số điện thoại"
                        defaultValue={dataNewAccount.phoneNumber}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Mật khẩu */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-passNew">
                        Mật khẩu <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="password"
                        id="nf-passNew"
                        name="nf-passNew"
                        placeholder="Nhập mật khẩu"
                        defaultValue={dataNewAccount.password}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Số điện thoại */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-basicSalaryNew">
                        Lương cơ bản <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        step={1000}
                        id="nf-basicSalaryNew"
                        name="nf-basicSalaryNew"
                        placeholder="Nhập lương cơ bản"
                        defaultValue={dataNewAccount.basicSalary}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Địa chỉ */}
                <CFormGroup>
                  <CLabel htmlFor="nf-addressNew">
                    Địa chỉ <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-addressNew"
                    name="nf-addressNew"
                    placeholder="Nhập địa chỉ"
                    defaultValue={dataNewAccount.address}
                  />
                </CFormGroup>
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
            {validTextImportNew}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="mr-2"
            shape="pill"
            onClick={handlerInsertNew}
          >
            Thêm mới
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => {
              setShowModalAddAccount(!showModalAddAccount);
              resetData();
            }}
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
        <CButton color="success" shape="pill" onClick={handlerOnClickAdd}>
          Thêm shipper mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <ListShipper ref={childRef} />
      </CCardBody>
    </CCard>
  );
};

export default Shippers;
