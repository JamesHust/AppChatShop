import React, { lazy } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import MonitorOrdersChart from "./MonitorOrdersChart";
import MonitorCateChart from "./MonitorCateChart";
import RevenueChart from "./RevenueChart";
import COLORS from "src/constants/colors";
import InforShop from "./InforShop";
const Widgets = lazy(() => import("./Widgets"));

const Home = () => {
  return (
    <>
      <CRow>
        <CCol md="8">
          {/* Widgets theo dõi đơn đặt hàng trong ngày*/}
          <Widgets />
          {/* Biểu đồ theo dõi lượng mua hàng theo ngày, tuần tháng */}
          <CCard style={{ borderRadius: 15 }}>
            <CCardBody>
              <CRow>
                <CCol sm="5">
                  <h4 id="traffic" className="card-title mb-0">
                    Lượng đơn hàng
                  </h4>
                  <div className="small text-muted">15/05/2020</div>
                </CCol>
                <CCol sm="7" className="d-none d-md-block">
                  {/* Download biểu đồ thống kê */}
                  <CButton
                    style={{ backgroundColor: COLORS.light_blue_13 }}
                    className="float-right"
                  >
                    <CIcon
                      name="cil-cloud-download"
                      style={{ color: COLORS.light }}
                    />
                  </CButton>
                </CCol>
              </CRow>
              <MonitorOrdersChart
                style={{ height: "300px", marginTop: "40px" }}
              />
            </CCardBody>
          </CCard>
          <CCard style={{ borderRadius: 15, overflow: "hidden" }}>
            <CCardHeader style={{ fontWeight: "bold", fontSize: 18 }}>
              Doanh thu
            </CCardHeader>
            <CCardBody>
              <RevenueChart />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <MonitorCateChart />
          <InforShop />
        </CCol>
      </CRow>
    </>
  );
};

export default Home;
