import React from "react";
import {
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { title, borderCustom } from "../../constants/common";
import FailedOrders from "./FailedOrders";
import SuccessedOrders from "./SuccessedOrders";
import COLORS from "src/constants/colors";

const CompleteOrders = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Danh sách đơn hàng</div>
        <CButton
          color="success"
          style={{ borderRadius: 100 }}
          onClick={reloadPage}
        >
          <CIcon name="cil-reload" style={{ color: COLORS.light }} size="lg" />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTabs activeTab="successed">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="successed">Thành công</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="failed">Thất bại</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane data-tab="successed">
              <SuccessedOrders />
            </CTabPane>
            <CTabPane data-tab="failed">
              <FailedOrders />
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default CompleteOrders;
