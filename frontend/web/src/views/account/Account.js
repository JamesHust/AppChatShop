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
  CInputFile,
  CTooltip,
  CSelect,
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector, useDispatch } from "react-redux";
import { addDotToNumber, formatDateInput } from "../../utils/Common";
import * as authActions from "../../redux/actions/auth";
import { SERVER_URL } from "src/config/config";

const Account = () => {
  const admin = useSelector((state) => state.authReducer.admin);
  const gender = useSelector((state) => state.constantReducer.gender);
  const role = useSelector((state) => state.constantReducer.role);
  const [account, setAccount] = useState({
    avatar: admin.avatar,
    adminId: admin.adminId,
    adminCode: admin.adminCode,
    iDCardCode: admin.iDCardCode,
    adminName: "",
    role: admin.role,
    gender: "",
    birthday: "",
    phoneNumber: "",
    email: "",
    basicSalary: "",
    address: "",
    homeTown: "",
    password: "",
  });
  const [validUpdateInfo, setValidUpdateInfo] = useState("");
  const [showModalChangePass, setShowModalChangePass] = useState(false);
  const dispatch = useDispatch();

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

  // Hàm check validate cho form
  const checkValidFormInfo = () => {
    const adminName = document.getElementById("nf-name").value;
    const address = document.getElementById("nf-address").value;
    const homeTown = document.getElementById("nf-homeTown").value;
    if (
      adminName &&
      account.role &&
      address &&
      homeTown
    ) {
      setValidUpdateInfo("");
      return true;
    } else {
      setValidUpdateInfo(
        "Vui lòng nhập đầy đủ các trường thay đổi và không được để trống các trường bắt buộc."
      );
      return false;
    }
  };

  // Hàm thực hiện cập nhật tài khoản admin
  const handlerUpdateInfo = async () => {
    if (checkValidFormInfo()) {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        const avatarAdmin = document.querySelector("input[type=file]");
        formData.append("file", avatarAdmin.files[0]);
        formData.append(
          "admin",
          JSON.stringify({
            adminId: account.adminId,
            adminName: account.adminName,
            gender: account.gender,
            birthday: account.birthday,
            address: account.address,
            homeTown: account.homeTown,
          })
        );
        const response = await fetch(`${SERVER_URL}admins`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "x-access-token": token,
          },
          body: formData,
        });
        switch (response.status) {
          case 200:
            const data = {
              token: token,
              adminId: account.adminId,
            };
            dispatch(authActions.getAdmin(data));
            break;
          default:
            alert("Có lỗi xảy ra khi cập nhật thông tin tài khoản.");
            break;
        }
      } catch (err) {
        alert(`Có lỗi xảy ra khi cập nhật thông tin tài khoản: ${err}.`);
      }
    }
  };

  // Hàm xử lý khi click vào nút thay đổi mật khẩu
  const handlerClickChangePass = () => {
    setShowModalChangePass(true);
  };

  // Modal thay đổi mật khẩu
  const ChangePasswordModal = () => {
    const [passData, setPassData] = useState({
      oldPass: "",
      reOldPass: "",
      newPass: "",
    });
    const [validPassText, setValidPassText] = useState("");

    // hàm check validate mật khẩu khi nhập
    const checkValidPass = (val, nameField) => {
      if (val.trim().length >= 8) {
        setValidPassText("");
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.test(String(val))) {
          setValidPassText("");
          return true;
        } else {
          setValidPassText(
            `${nameField} phải có ít nhất một chữ hoa, một chữ thường, một ký tự và một số.`
          );
          return false;
        }
      } else {
        setValidPassText(`${nameField} phải có ít nhất 8 ký tự.`);
        return false;
      }
    };

    // Check mật khẩu trước khi yêu cầu thay đổi mật khẩu
    const checkValidPassOnClick = () => {
      console.log("checkValidPassOnClick");
      if (passData.oldPass === passData.reOldPass) {
        if (passData.newPass === passData.oldPass) {
          setValidPassText("Mật khẩu mới đang trùng với mật khẩu cũ.");
          return false;
        } else {
          setValidPassText("");
          return true;
        }
      } else {
        setValidPassText("Mật khẩu cũ và mật khẩu nhập lại không trùng khớp.");
        return false;
      }
    };

    // Hàm thực hiện thay đổi
    const handlerChangePass = async () => {
      if (
        checkValidPassOnClick() &&
        checkValidPass(passData.oldPass, "Mật khẩu cũ") &&
        checkValidPass(passData.reOldPass, "Mật khẩu nhập lại") &&
        checkValidPass(passData.newPass, "Mật khẩu mới")
      ) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${SERVER_URL}admins/password`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token,
              },
              body: JSON.stringify({
                adminId: admin.adminId,
                oldPass: passData.oldPass,
                newPass: passData.newPass,
              }),
            }
          );
          switch (response.status) {
            case 200:
              const resData = await response.json();
              if (resData.isSuccess) {
                setValidPassText("");
                dispatch(authActions.changePass(resData.data));
                setShowModalChangePass(false);
              } else {
                setValidPassText(
                  "Mật khẩu cũ của bạn không đúng. Vui lòng nhập lại."
                );
              }
              break;
            default:
              break;
          }
        } catch (err) {
          alert(`Lỗi hệ thống : ${err}`);
        }
      }
    };

    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalChangePass}
        onClose={() => setShowModalChangePass(!showModalChangePass)}
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thay đổi mật khẩu</CModalTitle>
        </CModalHeader>
        <CModalBody
          style={{ marginLeft: 30, marginRight: 30 }}
          className="pb-5"
        >
          <CForm action="" method="post">
            <CFormGroup>
              <CLabel htmlFor="nf-oldPass">
                Mật khẩu cũ <span className="text-danger">(*)</span>
              </CLabel>
              <CInput
                type="password"
                id="nf-oldPass"
                name="nf-oldPass"
                placeholder="Nhập mật khẩu cũ"
                defaultValue={passData.oldPass}
                onChange={(event) =>
                  setPassData({ ...passData, oldPass: event.target.value })
                }
                onBlur={() => checkValidPass(passData.oldPass, "Mật khẩu cũ")}
              />
            </CFormGroup>
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-reOldPass">
                Nhập lại mật khẩu cũ <span className="text-danger">(*)</span>
              </CLabel>
              <CInput
                type="password"
                id="nf-reOldPass"
                name="nf-reOldPass"
                placeholder="Nhập lại mật khẩu cũ"
                defaultValue={passData.reOldPass}
                onChange={(event) =>
                  setPassData({ ...passData, reOldPass: event.target.value })
                }
                onBlur={() =>
                  checkValidPass(passData.reOldPass, "Mật khẩu nhập lại")
                }
              />
            </CFormGroup>
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-amountImport">
                Mật khẩu mới <span className="text-danger">(*)</span>
              </CLabel>
              <CInput
                type="password"
                id="nf-amountImport"
                name="nf-amountImport"
                placeholder="Nhập mật khẩu mới"
                defaultValue={passData.newPass}
                onChange={(event) =>
                  setPassData({ ...passData, newPass: event.target.value })
                }
                onBlur={() => checkValidPass(passData.newPass, "Mật khẩu mới")}
              />
            </CFormGroup>
          </CForm>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 15,
              color: "red",
              width: "82%",
            }}
          >
            {validPassText}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="warning"
            style={{ color: COLORS.light }}
            shape="pill"
            onClick={handlerChangePass}
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
                  src={
                    account.avatar
                      ? account.avatar
                      : "https://i.pinimg.com/originals/fe/91/6c/fe916cc5dd145ff1b57b8eb43dbf2234.gif"
                  }
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
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-code">
                        Mã quản trị <span className="text-danger">(*)</span>
                      </CLabel>

                      <CInput
                        disabled
                        style={{ background: COLORS.light }}
                        type="text"
                        id="nf-code"
                        name="nf-code"
                        defaultValue={admin.adminCode}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            adminCode: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CTooltip>
                </CCol>
                {/* Mã CCCD/CMND */}
                <CCol>
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-idCartCode">
                        Số CMND/CCCD <span className="text-danger">(*)</span>
                      </CLabel>

                      <CInput
                        disabled
                        style={{ background: COLORS.light }}
                        type="text"
                        id="nf-idCartCode"
                        name="nf-idCartCode"
                        defaultValue={admin.iDCardCode}
                      />
                    </CFormGroup>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                {/* Tên quản trị viên */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-name">
                      Tên quản trị viên <span className="text-danger">(*)</span>
                    </CLabel>
                    <CInput
                      type="text"
                      id="nf-name"
                      name="nf-name"
                      defaultValue={admin.adminName}
                      onChange={(event) =>
                        setAccount({
                          ...account,
                          adminName: event.target.value,
                        })
                      }
                    />
                  </CFormGroup>
                </CCol>
                {/* Giới tính */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-name">Giới tính</CLabel>
                    <CSelect
                      id="nf-gender"
                      name="nf-gender"
                      aria-label="Chọn giới tính"
                      defaultValue={admin.gender}
                      onChange={(event) =>
                        setAccount({
                          ...account,
                          gender: event.target.value,
                        })
                      }
                    >
                      {gender.map((item) => (
                        <option value={item.typeGender} key={item.typeGender}>
                          {item.genderName}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                {/* Ngày sinh */}
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="nf-birthday">Ngày sinh</CLabel>
                    <CInput
                      type="date"
                      id="nf-birthday"
                      name="nf-birthday"
                      defaultValue={formatDateInput(admin.birthday)}
                      onChange={(event) =>
                        setAccount({
                          ...account,
                          birthday: event.target.value,
                        })
                      }
                    />
                  </CFormGroup>
                </CCol>
                {/* Số điện thoại */}
                <CCol>
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-phone">
                        Số điện thoại <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        type="text"
                        id="nf-phone"
                        name="nf-phone"
                        defaultValue={admin.phoneNumber}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            phoneNumber: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CTooltip>
                </CCol>
              </CRow>
              {/* Số điện thoại và Email*/}
              <CRow>
                {/* Email */}
                <CCol>
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-email">
                        Email <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        type="email"
                        id="nf-email"
                        name="nf-email"
                        defaultValue={admin.email}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            email: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CTooltip>
                </CCol>
                {/* Vai trò */}
                <CCol>
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-role">
                        Vai trò <span className="text-danger">(*)</span>
                      </CLabel>
                      <CSelect
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        id="nf-role"
                        name="nf-role"
                        aria-label="Chọn vai trò"
                        defaultValue={admin.role}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            role: event.target.value,
                          })
                        }
                      >
                        {role.map((item) => (
                          <option value={item.typeRole} key={item.typeRole}>
                            {item.roleName}
                          </option>
                        ))}
                      </CSelect>
                    </CFormGroup>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  {/* Lương cơ bản */}
                  <CTooltip
                    content="Trường này không được phép thay đổi"
                    placement="right"
                  >
                    <CFormGroup>
                      <CLabel htmlFor="nf-basicSalary">
                        Lương cơ bản <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        disabled
                        style={{ backgroundColor: COLORS.light }}
                        type="text"
                        id="nf-basicSalary"
                        name="nf-basicSalary"
                        defaultValue={addDotToNumber(admin.basicSalary)}
                        onChange={(event) =>
                          setAccount({
                            ...account,
                            basicSalary: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CTooltip>
                </CCol>
                <CCol>
                  {/* Quê quán */}
                  <CFormGroup>
                    <CLabel htmlFor="nf-homeTown">
                      Quê quán <span className="text-danger">(*)</span>
                    </CLabel>
                    <CInput
                      type="text"
                      id="nf-homeTown"
                      name="nf-homeTown"
                      defaultValue={admin.homeTown}
                      onChange={(event) =>
                        setAccount({
                          ...account,
                          homeTown: event.target.value,
                        })
                      }
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              {/* Địa chỉ hiện tại */}
              <CFormGroup>
                <CLabel htmlFor="nf-address">
                  Địa chỉ hiện tại <span className="text-danger">(*)</span>
                </CLabel>
                <CInput
                  type="text"
                  id="nf-address"
                  name="nf-address"
                  defaultValue={admin.address}
                  onChange={(event) =>
                    setAccount({
                      ...account,
                      address: event.target.value,
                    })
                  }
                />
              </CFormGroup>
              <div className="d-flex justify-content-end mt-5">
                <CButton
                  color="warning"
                  style={{ color: COLORS.light }}
                  shape="pill"
                  onClick={handlerUpdateInfo}
                >
                  Cập nhật
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CForm>
        <div
          style={{
            position: "absolute",
            bottom: 75,
            left: 420,
            color: "red",
            width: "82%",
          }}
        >
          {validUpdateInfo}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default Account;
