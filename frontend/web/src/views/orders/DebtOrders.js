import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";

const DebtOrders = () => {
  // Dữ liệu demo
  const usersData = [
    {
      orderId: "4c9b5b4e-a21a-4608-9dd4-8524e0cee809",
      orderCode: "OR00001",
      orderShippingCode: "BKSHOP_OR00001",
      payment: "400,000",
      shipperName: "Nguyễn Văn A",
      phoneNumber: "0966073028",
      phoneNumberOther: "0911264086",
      status: "1",
    },
    {
      orderId: "60692e32-f9b7-4b8b-ad31-868c18e1435a",
      orderCode: "OR00002",
      orderShippingCode: "BKSHOP_OR00002",
      payment: "370,000",
      shipperName: "Nguyễn Thị Vải",
      phoneNumber: "0966073028",
      phoneNumberOther: "0911264086",
      status: "2",
    },
    {
      orderId: "6ce82a73-3bcd-4e8f-a22a-82e8c584d9a9",
      orderCode: "OR00003",
      orderShippingCode: "BKSHOP_OR00003",
      payment: "370,000",
      shipperName: "Mai Thế Hưng",
      phoneNumber: "0966073028",
      phoneNumberOther: "0911264086",
      status: "3",
    },
  ];
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  // Phần config tên cột, style độ rộng cho từng cột của bảng
  const fields = [
    {
      key: "orderCode",
      label: "Mã đơn",
      _style: { width: "10%" },
    },
    {
      key: "orderShippingCode",
      label: "Mã đơn ship",
      _style: { width: "10%" },
    },
    {
      key: "shipperName",
      label: "Shipper",
      _style: { width: "40%" },
    },
    {
      key: "phoneNumber",
      label: "Liên hệ",
      _style: { width: "10%" },
    },
    {
      key: "phoneNumberOther",
      label: "Liên hệ khác",
      _style: { width: "10%" },
    },
    {
      key: "payment",
      label: "Tiền nhận",
      _style: { width: "10%" },
    },
    {
      key: "updateStatus",
      label: "Cập nhật",
      _style: { width: "10%" },
    },
  ];

  // Modal xác nhận gạch nợ
  const ModalConfirm = () => {
    return (
      <CModal
        color="info"
        show={showModalConfirm}
        style={{ ...borderCustom }}
        onClose={() => setShowModalConfirm(!showModalConfirm)}
      >
        <CModalHeader closeButton>
          <CModalTitle>Xác nhận gạch nợ</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có xác định muốn gạch nợ cho đơn hàng này?</CModalBody>
        <CModalFooter>
          <CButton
            color="info"
            shape="pill"
            onClick={() => setShowModalConfirm(!showModalConfirm)}
          >
            Tiếp tục
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalConfirm(!showModalConfirm)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <CCard style={{ ...borderCustom }}>
      <ModalConfirm />
      <CCardHeader style={{ ...title }}>Danh sách công nợ</CCardHeader>
      <CCardBody>
        <CDataTable
          items={usersData}
          fields={fields}
          columnFilter
          tableFilter
          footer
          itemsPerPageSelect
          itemsPerPage={10}
          hover
          sorter
          pagination
          onRowClick={(item) => console.log(item)}
          scopedSlots={{
            updateStatus: (item) => (
              <td>
                <CButton
                  shape="pill"
                  color="info"
                  onClick={() => setShowModalConfirm(true)}
                >
                  Gạch nợ
                </CButton>
              </td>
            ),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default DebtOrders;
