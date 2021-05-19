import React from "react";
import { CCard, CCardBody, CCardHeader, CSwitch } from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const Setting = () => {
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader style={{ ...title }}>Thiết lập cài đặt</CCardHeader>
      <CCardBody>
        <table className="table table-striped" style={{ ...borderCustom }}>
          <thead style={{ backgroundColor: COLORS.dark, color: COLORS.light }}>
            <tr>
              <th>STT</th>
              <th style={{ fontSize: 16 }}>Hệ thống</th>
              <th style={{ textAlign: "center", fontSize: 16 }}>Bật/Tắt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Nhận thông báo</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch color="primary" variant="3d" defaultChecked />
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Tắt phân quyền</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch color="primary" variant="3d" />
              </td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Chủ đề</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch color="primary" variant="3d" />
              </td>
            </tr>
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  );
};

export default Setting;
