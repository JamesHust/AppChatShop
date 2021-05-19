import React from "react";
import {
  CCard,
  CCardBody,
  CTabs,
  CNavItem,
  CNavLink,
  CTabPane,
  CNav,
  CTabContent,
} from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import COLORS from "src/constants/colors";

const RevenueChart = (props) => {
  return (
    <>
      <CCard>
        <CCardBody>
          <CTabs activeTab="day">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="day">Theo ngày</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="month">Theo tháng</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="year">Theo năm</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="day">
                <CChartBar
                  type="bar"
                  datasets={[
                    {
                      label: "Doanh thu",
                      backgroundColor: COLORS.green_12,
                      data: [80, 75, 79, 85, 65, 60, 90, 50], //50 để fix cho giá trị bé nhất
                    },
                  ]}
                  labels={[
                    "6 giờ trước",
                    "5 giờ trước",
                    "4 giờ trước",
                    "3 giờ trước",
                    "2 giờ trước",
                    "1 giờ trước",
                    "Hiện tại",
                  ]}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CTabPane>
              <CTabPane data-tab="month">
                <CChartBar
                  type="bar"
                  datasets={[
                    {
                      label: "Doanh thu",
                      backgroundColor:COLORS.green_13,
                      data: [95, 65, 79, 50, 100], //50 để fix cho giá trị bé nhất
                    },
                  ]}
                  labels={["Hôm kia", "Hôm qua", "Hôm nay"]}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CTabPane>
              <CTabPane data-tab="year">
                <CChartBar
                  type="bar"
                  datasets={[
                    {
                      label: "Doanh thu",
                      backgroundColor:COLORS.green_14,
                      data: [95, 65, 79, 50, 100], //50 để fix cho giá trị bé nhất
                    },
                  ]}
                  labels={["Hôm kia", "Hôm qua", "Hôm nay"]}
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </>
  );
};
export default RevenueChart;
