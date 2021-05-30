import React from "react";
import { CCard, CCardBody, CCardHeader, CSwitch } from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";

const Permission = () => {
  const admin = useSelector((state) => state.authReducer.admin);
  return (
    <CCard style={{ ...borderCustom }}>
      <CCardHeader style={{ ...title }}>Quyền hệ thống</CCardHeader>
      <CCardBody>
        <table className="table table-striped" style={{ ...borderCustom }}>
          <thead style={{ backgroundColor: COLORS.dark, color: COLORS.light }}>
            <tr>
              <th>STT</th>
              <th style={{ fontSize: 16 }}>Tên quyền</th>
              <th style={{ textAlign: "center", fontSize: 16 }}>Bật/Tắt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Nhận thông báo</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked />
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Quản lý sản phẩm</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked />
              </td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Quản lý nhập hàng</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked />
              </td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Quản lý hóa đơn đang xử lý</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked/>
              </td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Quản lý hóa đơn hoàn thành</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked/>
              </td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>Quản lý công nợ</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked/>
              </td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>Quản lý nhân viên</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked={admin.role === 1 ? true: false}/>
              </td>
            </tr>
            <tr>
              <th scope="row">8</th>
              <td>Quản lý Shipper</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked={admin.role === 1 ? true: false}/>
              </td>
            </tr>
            <tr>
              <th scope="row">9</th>
              <td>Quản lý tính công</td>
              <td style={{ textAlign: "center" }}>
                <CSwitch disabled color="primary" variant="3d" checked={admin.role === 1 ? true: false}/>
              </td>
            </tr>
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  );
};

export default Permission;
