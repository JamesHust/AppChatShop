import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CImg,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import * as authActions from "../../../redux/actions/auth";
import * as constantActions from "../../../redux/actions/constant";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "src/config/config";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    isValidUser: true,
    isValidPass: true,
  });
  const [notificationValid, setNotificationValid] = useState();
  const history = useHistory();
  const dispatch = useDispatch(); //khởi tạo dispatch

  // Hàm validate cho tên đăng nhập
  const handleValidUser = (val) => {
    if (val.trim().length >= 10) {
      setData({
        ...data,
        isValidUser: true,
      });
      setNotificationValid("");
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
      setNotificationValid("Tên đăng nhập phải có ít nhất 10 ký tự");
    }
  };

  // Hàm validate cho mật khẩu
  const handleValidPass = (val) => {
    if (val.trim().length >= 8) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(String(val))) {
        setData({
          ...data,
          isValidPass: true,
        });
        setNotificationValid("");
      } else {
        setData({
          ...data,
          isValidPass: false,
        });
        setNotificationValid(
          "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một ký tự và một số."
        );
      }
    } else {
      setData({
        ...data,
        isValidPass: false,
      });
      setNotificationValid("Mật khẩu phải có ít nhất 8 ký tự.");
    }
  };

  // Lấy mã vùng
  const getArea = async (token, shopId) => {
    // Lấy mã vùng
    const response = await fetch(
      `${SERVER_URL}shops/${shopId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    if (response.status === 200) {
      const resData = await response.json();
      return resData.data.areaId;
    }else return null;
  }

  // Hàm xử lý login
  const handlerLogin = async () => {
    if (!data.isValidUser || !data.isValidPass) {
      setNotificationValid(
        "Tài khoản nhập đang bị sai. Vui lòng nhập đúng tên đăng nhập và mật khẩu của bạn."
      );
    } else {
      try {
        //thực hiện đăng nhập, gửi request lên server để check tài khoản
        const response = await fetch(`${SERVER_URL}login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUser: {
              username: data.username,
              password: data.password,
            },
            actor: "admin",
          }),
        });
        switch (response.status) {
          case 200:
            const resData = await response.json();
            const shopId = resData.data.admin.shopId ? resData.data.admin.shopId  : resData.data.admin.ShopId;
            const areaId = await getArea(resData.data.accessToken, shopId);
            if(areaId){
              dispatch(authActions.storageToken(resData.data, areaId));
              dispatch(constantActions.getConstants());
              console.log(localStorage.getItem("areaId"));
              history.push("/statistical");
            }
            break;
          case 400:
            setNotificationValid(
              "Dữ liệu truyền sang đang bị trống. Vui lòng nhập tài khoản của bạn."
            );
            break;
          case 404:
            setNotificationValid(
              "Không tồn tại tài khoản phù hợp. Vui lòng nhập lại tài khoản của bạn."
            );
            break;
          case 500:
            alert("Lỗi hệ thống");
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
    <div
      className="c-app c-default-layout flex-row align-items-center"
      style={{
        background:
          "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)",
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8" style={{ borderRadius: 15 }}>
            <CCardGroup style={{ borderRadius: 15, overflow: "hidden" }}>
              <CCard className="p-4">
                <CCardBody>
                  <CForm className="mt-5">
                    <h1>Đăng nhập</h1>
                    <p className="text-muted">
                      Đăng nhập với tư cách quản lý cửa hàng
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Tên đăng nhập"
                        required
                        onChange={(event) =>
                          setData({ ...data, username: event.target.value })
                        }
                        onBlur={(event) => handleValidUser(event.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Mật khẩu"
                        required
                        onChange={(event) =>
                          setData({ ...data, password: event.target.value })
                        }
                        onSubmit={handlerLogin}
                        onBlur={(event) => handleValidPass(event.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={handlerLogin}
                        >
                          Đăng nhập
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">
                          Quên mật khẩu?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                <div
                  style={{
                    position: "absolute",
                    bottom: 30,
                    left: 40,
                    color: "red",
                    width: "82%",
                  }}
                >
                  {notificationValid}
                </div>
              </CCard>
              <CCard
                className="text-white d-md-down-none"
                style={{ width: "44%" }}
              >
                <div>
                  <div>
                    <CImg src={"login1.jpg"} style={{ width: "100%" }} />
                  </div>
                </div>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
