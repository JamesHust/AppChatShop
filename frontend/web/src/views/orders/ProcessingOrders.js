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
  CButton
} from "@coreui/react";
import CIcon from '@coreui/icons-react'
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import ProcessOrders from "./ProcessOrders";
import WaitingOrders from "./WaitingOrders";
import ShippingOrders from "./ShippingOrders";
import CancelOrders from "./CancelOrders";
import DeliveredOrders from "./DeliveredOrders";

const ProcessingOrders = () => {
  const reloadPage = (count) => {
    window.location.reload();
  }
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Danh sách đơn hàng</div>
        <CButton color="success" style={{borderRadius: 100}} onClick={reloadPage}>
          <CIcon name="cil-reload" style={{color: COLORS.light}} size="lg"/>
        </CButton>
      </CCardHeader>
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
