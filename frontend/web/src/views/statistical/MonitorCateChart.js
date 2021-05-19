import React from "react";
import {
  CCol,
  CProgress,
  CRow,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";

import COLORS from "../../constants/colors";

/**
 * Biểu đồ theo dõi lượng bán ra của các
 * @returns
 */
const MonitorCateChart = (props) => {
  // render
  return (
    <CCard style={{borderRadius: 15, overflow: 'hidden'}}>
      <CCardHeader style={{ fontWeight: "bold", fontSize: 18 }}>
        Biểu đồ tỷ lệ loại sản phẩm & giới tính
      </CCardHeader>
      <CCardBody>
        <CChartDoughnut
          datasets={[
            {
              backgroundColor: [
                COLORS.yellow_14,
                COLORS.orange_14,
                COLORS.red_13,
                COLORS.green_14,
                COLORS.teal_14,
              ],
              data: [15, 20, 40, 15, 10],
            },
          ]}
          labels={["Hoa quả", "Bánh kẹo", "Thịt", "Rau", "Khác"]}
          options={{
            tooltips: {
              enabled: true,
            },
          }}
        />
      </CCardBody>
      <CCardHeader />
      <CCardBody>
        <CCol xs="12" md="12" xl="12">
          <CRow>
            <CCol sm="4">
              <CCallout color="warning">
                <small className="text-muted">Nam</small>
                <br />
                <strong className="h4">78,623</strong>
              </CCallout>
            </CCol>
            <CCol sm="4">
              <CCallout color="success">
                <small className="text-muted">Nữ</small>
                <br />
                <strong className="h4">49,123</strong>
              </CCallout>
            </CCol>
            <CCol sm="4">
              <CCallout color="danger">
                <small className="text-muted">Khác</small>
                <br />
                <strong className="h4">49,123</strong>
              </CCallout>
            </CCol>
          </CRow>

          <hr className="mt-0" />

          <div className="progress-group mb-4">
            <div className="progress-group-header">
              <CIcon className="progress-group-icon" name="cil-user" />
              <span className="title">Nam</span>
              <span className="ml-auto font-weight-bold">43%</span>
            </div>
            <div className="progress-group-bars">
              <CProgress className="progress-xs" color="warning" value="43" />
            </div>
          </div>
          <div className="progress-group mb-4">
            <div className="progress-group-header">
              <CIcon className="progress-group-icon" name="cil-user-female" />
              <span className="title">Nữ</span>
              <span className="ml-auto font-weight-bold">43%</span>
            </div>
            <div className="progress-group-bars">
              <CProgress className="progress-xs" color="success" value="43" />
            </div>
          </div>
          <div className="progress-group mb-5">
            <div className="progress-group-header">
              <CIcon className="progress-group-icon" name="cil-user-female" />
              <span className="title">Khác</span>
              <span className="ml-auto font-weight-bold">37%</span>
            </div>
            <div className="progress-group-bars">
              <CProgress className="progress-xs" color="danger" value="37" />
            </div>
          </div>
        </CCol>
      </CCardBody>
    </CCard>
  );
};

export default MonitorCateChart;
