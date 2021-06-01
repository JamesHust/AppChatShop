import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from "@coreui/react";
// sidebar nav config
import navigation from "./_nav";
import Logo3 from "../assets/logos/logo3.png";
import Logo2 from "../assets/logos/logo2.png";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const [nav, setNav] = useState([]);
  const show = useSelector((state) => state.navReducer.sidebarShow);
  const admin = useSelector((state) => state.authReducer.admin);

  //Theo dõi sự thay đổi redux để check lại quyền admin
  useEffect(() => {
    if (admin.role === 1) {
      const index = navigation.find(i => i.name === "Quản lý nhân sự");
      if(!index){
        navigation.splice(5, 0, {
          _tag: "CSidebarNavDropdown",
          name: "Quản lý nhân sự",
          to: "/employees",
          icon: "cil-group",
          _children: [
            {
              _tag: "CSidebarNavItem",
              name: "Nhân viên",
              to: "/employees/account",
            },
            {
              _tag: "CSidebarNavItem",
              name: "Nhân viên giao hàng",
              to: "/shippers",
            },
            {
              _tag: "CSidebarNavItem",
              name: "Tính công",
              to: "/salary",
            },
          ],
        });
      }
    } else {
      if(navigation.length === 10){
        navigation.splice(5, 1);
      }
    }
    setNav(navigation);
  }, [admin]);
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      {/* Phần logo của web*/}
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg src={Logo3} width={110} className="c-sidebar-brand-full" />
        <CImg src={Logo2} width={30} className="c-sidebar-brand-minimized" />
      </CSidebarBrand>
      {/* Navbar của web */}
      <CSidebarNav>
        <CCreateElement
          items={nav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
