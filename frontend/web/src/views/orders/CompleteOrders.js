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
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import FailedOrders from "./FailedOrders";
import SuccessedOrders from "./SuccessedOrders";

const CompleteOrders = () => {
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader style={{ ...title }}>Danh sách đơn hàng</CCardHeader>
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
