import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../redux/actions/auth";

const TheHeaderDropdown = () => {
  const history = useHistory();
  const dispatch = useDispatch(); //khởi tạo dispatch
  const admin = useSelector((state) => state.authReducer.admin);

  // hàm xử lý sự kiện đăng xuất
  const logoutHandle = () => {
    try {
      dispatch(authActions.logout());
      history.push("/login");
    } catch (err) {
      <CAlert color="danger">Có lỗi không mong muốn: {err}</CAlert>;
    }
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={
              admin.avatar
                ? admin.avatar
                : "https://i.pinimg.com/originals/fe/91/6c/fe916cc5dd145ff1b57b8eb43dbf2234.gif"
            }
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
            style={{ width: 45 }}
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="py-0" placement="bottom-end">
        <CDropdownItem onClick={logoutHandle}>
          <CIcon name="cil-account-logout" className="mfe-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
