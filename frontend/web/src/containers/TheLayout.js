import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";
import * as authActions from "../redux/actions/auth";

/**
 * Bố cục giao diện web chính
 * @returns
 */
const TheLayout = (props) => {
  const { history } = props;
  const dispatch = useDispatch(); //khởi tạo dispatch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const createdToken = localStorage.getItem("createdToken");
    const areaId = localStorage.getItem("areaId");
    const current = new Date();
    // Kiểm tra tồn tại token, hạn token quá 6h
    if (!token || !createdToken || +(current - createdToken) >= 6 * 3600000) {
      alert(`Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!`);
      dispatch(authActions.logout());
      history.push("/login");
    }
    if (!areaId) {
      alert(`Lỗi không lấy được mã vùng. Vui lòng đăng nhập lại!`);
      dispatch(authActions.logout());
      history.push("/login");
    }
  }, [history, dispatch]);

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
