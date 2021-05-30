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
import ProcessOrders from "./ProcessOrders";
import WaitingOrders from "./WaitingOrders";
import ShippingOrders from "./ShippingOrders";
import CancelOrders from "./CancelOrders";
import DeliveredOrders from "./DeliveredOrders";

const ProcessingOrders = () => {
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader style={{ ...title }}>Danh sách đơn hàng</CCardHeader>
      <CCardBody>
        <CTabs activeTab="wait">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="wait">Đang đợi</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="process">Đang xử lý</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="ship">Đang giao hàng</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="delivered">Đã giao hàng</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="cancel">Bị hủy</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane data-tab="wait">
              <WaitingOrders />
            </CTabPane>
            <CTabPane data-tab="process">
              <ProcessOrders />
            </CTabPane>
            <CTabPane data-tab="ship">
              <ShippingOrders />
            </CTabPane>
            <CTabPane data-tab="delivered">
              <DeliveredOrders />
            </CTabPane>
            <CTabPane data-tab="cancel">
              <CancelOrders />
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default ProcessingOrders;
