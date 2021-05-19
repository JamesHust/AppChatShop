import React from "react";
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";
import ChartBarSimple from "../charts/ChartBarSimple";
import COLORS from "../../constants/colors";

// Biểu đồ thống kê chung
const Widgets = () => {
  return (
    <CRow>
      {/* Theo dõi số đơn hàng trong ngày */}
      <CCol sm="6" lg="4">
        <CWidgetDropdown
          style={{ borderRadius: 15, backgroundColor: COLORS.light_blue_4 }}
          header="9.823"
          text="Đơn hàng trong ngày"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{ height: "70px" }}
              dataPoints={[65, 59, 84, 84, 51, 55, 40]}
              backgroundColor={COLORS.light_blue_4}
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CIcon name="cilClone" width={30} />
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
      {/* Theo dõi doanh thu trong ngày */}
      <CCol sm="6" lg="4">
        <CWidgetDropdown
          style={{
            borderRadius: 15,
            backgroundColor: COLORS.green_13,
            overflow: "hidden",
          }}
          header="9.823"
          text="Doanh thu"
          footerSlot={
            <ChartLineSimple
              className="mt-3"
              style={{ height: "70px" }}
              backgroundColor={COLORS.green_13}
              dataPoints={[78, 81, 80, 45, 34, 12, 40]}
              options={{ elements: { line: { borderWidth: 2.5 } } }}
              pointHoverBackgroundColor="warning"
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CIcon name="cil-task" width={30} />
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
      {/* Theo dõi lợi nhuận */}
      <CCol sm="6" lg="4">
        <CWidgetDropdown
          style={{ borderRadius: 15, backgroundColor: COLORS.red_12 }}
          header="9.823"
          text="Lợi nhuận"
          footerSlot={
            <ChartBarSimple
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              backgroundColor={COLORS.red_11}
              label="Members"
              labels="months"
            />
          }
        >
          <CDropdown>
            <CIcon name="cil-mood-bad" width={30}/>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  );
};

export default Widgets;
