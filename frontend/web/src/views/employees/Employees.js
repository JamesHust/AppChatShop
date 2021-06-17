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
  CSelect,
  CModalFooter,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";
import ListEmployee from "./ListEmployee";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";
import { SERVER_URL } from "src/config/config";

const Employees = () => {
  const [showModalAddAccount, setShowModalAddAccount] = useState(false);
  const admin = useSelector((state) => state.authReducer.admin);
  const gender = useSelector((state) => state.constantReducer.gender);
  const childRef = useRef();

  // Modal thêm mới nhân viên
  const ImportNewEmployeeModal = () => {
    const [dataNewAccount, setDataNewAccount] = useState({
      iDCardCode: "",
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
      basicSalary: "0",
      shopId: admin.shopId,
    });
    const [validTextImportNew, setValidTextImportNew] = useState("");

    // reset lại dữ liệu khi đóng form
    const resetData = () => {
      document.getElementById("imgEmployeeNew").value = "";
      setDataNewAccount({
        iDCardCode: "",
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
        basicSalary: "0",
        shopId: "",
      });
    };

    // Hàm check validate các trường, form
    const checkValidImportNew = () => {
      var file = document.querySelector("input[id='imgEmployeeNew']").files[0];
      if (file) {
        const adminName = document.getElementById("nf-nameNew").value;
        const iDCardCode = document.getElementById("nf-idCardCodeNew").value;
        const homeTown = document.getElementById("nf-homeTownNew").value;
        const basicSalary = document.getElementById("nf-basicSalaryNew").value;
        const phoneNumber = document.getElementById("nf-phoneNew").value;
        const password = document.getElementById("nf-passNew").value;
        const email = document.getElementById("nf-emailNew").value;
        const address = document.getElementById("nf-addressNew").value;
        if (
          adminName &&
          iDCardCode &&
          homeTown &&
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
          if (iDCardCode.length !== 12) {
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

    // Hàm thực hiện thêm nhân viên mới
    const handlerInsertNew = async () => {
      if (checkValidImportNew()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector("input[id='imgEmployeeNew']");
          formData.append("file", productImage.files[0]);
          formData.append(
            "admin",
            JSON.stringify({
              iDCardCode: document.getElementById("nf-idCardCodeNew").value,
              adminName: document.getElementById("nf-nameNew").value,
              phoneNumber: document.getElementById("nf-phoneNew").value,
              email: document.getElementById("nf-emailNew").value,
              address: document.getElementById("nf-addressNew").value,
              password: document.getElementById("nf-passNew").value,
              birthday: document.getElementById("nf-birthdayNew").value,
              gender: document.getElementById("nf-genderNew").value,
              homeTown: document.getElementById("nf-homeTownNew").value,
              basicSalary: document.getElementById("nf-basicSalaryNew").value,
              role: 2,
              shopId: dataNewAccount.shopId,
              roleAction: admin.role,
            })
          );
          const response = await fetch(`${SERVER_URL}admins`, {
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
              alert("Lỗi không thêm mới được nhân viên");
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
      var file = document.querySelector("input[id='imgEmployeeNew']").files[0];
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
      const imageFile = document.getElementById("imgEmployeeNew");
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
          <CModalTitle>Thêm mới tài khoản nhân viên</CModalTitle>
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
                  id="imgEmployeeNew"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  <CCol>
                    {/* Tên nhân viên */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-nameNew">
                        Tên nhân viên <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-nameNew"
                        name="nf-nameNew"
                        placeholder="Nhập tên nhân viên"
                        defaultValue={dataNewAccount.adminName}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Mã CMND/CCCD */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-idCardCodeNew">
                        Mã CMND/CCCD <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        style={{ backgroundColor: COLORS.light }}
                        type="number"
                        min={0}
                        id="nf-idCardCodeNew"
                        name="nf-idCardCodeNew"
                        placeholder="Nhập mã CMND/CCCD"
                        defaultValue={dataNewAccount.iDCardCode}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/*Giới tính*/}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-genderNew">Giới tính</CLabel>
                      <CSelect
                        id="nf-genderNew"
                        name="nf-genderNew"
                        aria-label="Chọn giới tính"
                        defaultValue={dataNewAccount.gender}
                      >
                        {gender.map((i) => (
                          <option value={i.typeGender} key={i.typeGender}>
                            {i.genderName}
                          </option>
                        ))}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  {/* Ngày sinh */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-birthdayNew">Ngày sinh</CLabel>
                      <CInput
                        type="date"
                        id="nf-birthdayNew"
                        name="nf-birthdayNew"
                        placeholder="Nhập ngày sinh"
                        defaultValue={dataNewAccount.birthday}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    {/* Quê quán */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-homeTownNew">
                        Quê quán <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-homeTownNew"
                        name="nf-homeTownNew"
                        placeholder="Nhập tên quê quán"
                        defaultValue={dataNewAccount.homeTown}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Lương cơ bản */}
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
                <CRow>
                  {/* Số điện thoại */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-phoneNew">
                        Số điện thoại <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-phoneNew"
                        name="nf-phoneNew"
                        placeholder="Nhập số điện thoại"
                        defaultValue={dataNewAccount.phoneNumber}
                      />
                    </CFormGroup>
                  </CCol>
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
                </CRow>
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
      <ImportNewEmployeeModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Quản lý nhân viên</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => {
            document.getElementById("imgEmployeeNew").value = "";
            setShowModalAddAccount(true);
          }}
        >
          Thêm mới nhân viên
        </CButton>
      </CCardHeader>
      <CCardBody>
        <ListEmployee ref={childRef} />
      </CCardBody>
    </CCard>
  );
};

export default Employees;
