import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabPane,
  CTabContent,
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import SalaryEmployees from "./SalaryEmployees";
import SalaryShipper from "./SalaryShipper";

const SalaryEmployee = () => {
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader style={{ ...title }}>Tính công</CCardHeader>
      <CCardBody>
        <CTabs activeTab="employee">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="employee">Nhân viên</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="shipper">Shipper</CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane data-tab="employee">
              <SalaryEmployees />
            </CTabPane>
            <CTabPane data-tab="shipper">
              <SalaryShipper />
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default SalaryEmployee;
