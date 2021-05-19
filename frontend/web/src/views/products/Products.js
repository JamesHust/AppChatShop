import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CRow,
  CCol,
  CInputFile,
  CInput,
  CLabel,
  CFormGroup,
  CModalFooter,
  CButton,
  CImg,
  CTooltip,
  CTextarea,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";

const Products = () => {
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showModalUpdateProd, setShowModalUpdateProd] = useState(false);
  const [dataModal, setDataModal] = useState({
    productId: "",
    productCode: "",
    productName: "",
    description: "",
    unit: "",
    imageUrl: "",
    importPrice: "",
    purchasePrice: "",
    amount: "",
    quantitySold: "",
    dateOfImport: "",
    rating: "",
    sale: 0,
    shopId: "",
    categoryId: "",
    cartId: "",
    orderId: "",
    productAmount: "",
    productPrice: "",
    shopName: "",
    categoryName: "",
  });
  // Dữ liệu demo
  const usersData = [
    {
      productId: "4c9b5b4e-a21a-4608-9dd4-8524e0cee809",
      productCode: "SP00001",
      productName: "Dưa hấu không hạt 2.5kg",
      description:
        "Dưa hấu không hạt là giống quả mới lạ và độc đáo. Quả dưa tròn, da xanh nhạt có gân xanh đậm, vỏ mỏng, nhiều nước, không có hạt và vị ngọt đậm đà.",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/watermelon.jpg",
      importPrice: "64750",
      purchasePrice: "74750",
      amount: "60",
      quantitySold: "20",
      dateOfImport: "2020-12-31T17:00:00.000Z",
      rating: "4.7",
      sale: 0,
      shopId: "37ba18b3-f280-4a1c-86ec-a249f99e3405",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
    {
      productId: "60692e32-f9b7-4b8b-ad31-868c18e1435a",
      productCode: "SP00002",
      productName: "Dứa (thơm/khóm) 1 quả",
      description:
        "Dứa ( thơm/khóm) được trồng ở nhưng nơi có khí hậu ấm áp quanh năm. Dứa được trồng theo những tiêu chuẩn chất lượng hữu cơ, đảm bảo sản phẩm sạch, an toàn, không có chất kích thích tăng trường hay các hóa chất bảo vệ thực vật.",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/pineapple.jpg",
      importPrice: "10500",
      purchasePrice: "13800",
      amount: "60",
      quantitySold: "10",
      dateOfImport: "2021-03-28T10:00:00.000Z",
      rating: "4.1",
      sale: 0,
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
    {
      productId: "6ce82a73-3bcd-4e8f-a22a-82e8c584d9a9",
      productCode: "SP00003",
      productName: "Dưa hấu ruột vàng 2.5kg",
      description:
        "Dưa hấu ruột vàng 2.5kg là một đặc sản của đất Long An. Loại dưa này đặc biệt chỉ trồng đc ở 2 nơi duy nhất là Long An và Tiền Giang nước ta, trong đó loại của Long An trái to, vỏ mỏng và đạt độ ngọt cao hơn.",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/cantaloupe.jpg",
      importPrice: "65000",
      purchasePrice: "74750",
      amount: "55",
      quantitySold: "10",
      dateOfImport: "2020-12-31T17:00:00.000Z",
      rating: "4.6",
      sale: 0,
      shopId: "37ba18b3-f280-4a1c-86ec-a249f99e3405",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
    {
      productId: "92d58a42-8f41-4ec3-8841-228dc2c46e98",
      productCode: "SP00004",
      productName: "Táo Gala size 100 - 125 (XX Mỹ) 1kg",
      description:
        "Táo Gala size 100 - 125 (XX Mỹ) chứa nhiều chất pectin, một chất xơ hòa tan làm giảm cholesterol và chất chống oxi hóa, ngăn ngừa bệnh tim. Lượng magiê và kali trong táo giúp điều chỉnh áp suất máu và giữ cho nhịp đập tim ở mức ổn định.",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/apple.jpg",
      importPrice: "67000",
      purchasePrice: "75000",
      amount: "25",
      quantitySold: "0",
      dateOfImport: "2020-12-31T17:00:00.000Z",
      rating: "4.5",
      sale: 0,
      shopId: "37ba18b3-f280-4a1c-86ec-a249f99e3405",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
    {
      productId: "9f0a3d41-2b00-4c3c-92bc-57ed94c3879f",
      productCode: "SP00005",
      productName: "Bưởi hồng da xanh túi lưới 1.4kg",
      description:
        "Bưởi hồng da xanh túi lưới 1.4kg là một loại quả đặc sản của miền Tây Nam Bộ. Với các múi khi chín màu hồng đỏ rất dễ tách, múi bưởi mọng nước, vị ngọt, mùi thơm khi thưởng thức. Trở thành loại quả được sử dụng phổ biến và được nhiều người ưa chuộng!",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/grapefruit.jpg",
      importPrice: "60000",
      purchasePrice: "72100",
      amount: "52",
      quantitySold: "4",
      dateOfImport: "2020-12-31T17:00:00.000Z",
      rating: "5",
      sale: 0,
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
    {
      productId: "e4121319-2067-47a2-a324-24f33ee0ae26",
      productCode: "SP00006",
      productName: "Xoài cát chu 1kg",
      description:
        "Xoài xanh ngọt với bề ngoài màu xanh mướt bên trong vàng ươm, thịt dày, mùi thơm ngon và vị ngọt bùi.",
      unit: "Quả",
      imageUrl: "http://192.168.1.125:3000/public/products/mango.jpg",
      importPrice: "40000",
      purchasePrice: "47500",
      amount: "40",
      quantitySold: "0",
      dateOfImport: "2020-12-31T17:00:00.000Z",
      rating: "5",
      sale: 0,
      shopId: "b6d85673-f0bb-4fd0-aa8c-e8a8c99b880c",
      categoryId: "27b9f332-45cf-43ca-978b-8e7e03c118b6",
      categoryName: "Hoa quả",
    },
  ];

  // Phần config tên cột, style độ rộng cho từng cột của bảng
  const fields = [
    {
      key: "productCode",
      label: "Mã SP",
      _style: { width: "10%" },
    },
    {
      key: "productName",
      label: "Tên sản phẩm",
      _style: { width: "38%" },
    },
    {
      key: "unit",
      label: "Đơn vị",
      _style: { width: "8%" },
    },
    {
      key: "categoryName",
      label: "Loại",
      _style: { width: "8%" },
    },
    {
      key: "importPrice",
      label: "Giá nhập",
      _style: { width: "8%" },
    },
    {
      key: "purchasePrice",
      label: "Giá bán",
      _style: { width: "7%" },
    },
    {
      key: "amount",
      label: "SL còn",
      _style: { width: "7%" },
    },
    {
      key: "quantitySold",
      label: "SL đã bán",
      _style: { width: "7%" },
    },
    {
      key: "rating",
      label: "Đánh giá",
      _style: { width: "7%" },
    },
  ];

  // Hàm xử lý hiển thị khi chọn file
  const previewFile = () => {
    setDataModal({ ...dataModal, imageUrl: "" });
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setDataModal({ ...dataModal, imageUrl: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setDataModal({
        ...dataModal,
        imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
      });
    }
  };

  // Hàm xử lý mở chọn file ảnh
  const chooseImgHanler = () => {
    const imageFile = document.getElementById("imgProd");
    imageFile.click();
  };

  // Modal cập nhật thông tin sản phẩm
  const UpdateInfoProductModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalUpdateProd}
        onClose={() => setShowModalUpdateProd(!showModalUpdateProd)}
        size="lg"
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh sản phẩm */}
                <CImg
                  src={dataModal.imageUrl}
                  className="border"
                  style={{ borderRadius: 15, width: "100%" }}
                />
                {/* Chọn ảnh từ máy */}
                <div className="w-100 d-flex justify-content-center mt-2">
                  <CButton
                    className="btn-pill mx-auto"
                    color="warning"
                    onClick={chooseImgHanler}
                    variant="outline"
                  >
                    Chọn ảnh
                  </CButton>
                </div>
                <CInputFile
                  onChange={previewFile}
                  style={{ display: "none" }}
                  id="imgProd"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  {/* Mã SP */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-code">Mã SP</CLabel>
                        <CInput
                          style={{ backgroundColor: COLORS.light }}
                          disabled
                          type="text"
                          id="nf-code"
                          name="nf-code"
                          defaultValue={dataModal.productCode}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                  {/* Tên sản phẩm */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">Tên sản phẩm</CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        defaultValue={dataModal.productName}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Đơn vị */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-unit">Đơn vị</CLabel>
                      <CInput
                        type="text"
                        id="nf-unit"
                        name="nf-unit"
                        defaultValue={dataModal.unit}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Số lượng còn */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-amount">Số lượng trong kho</CLabel>
                      <CInput
                        type="text"
                        id="nf-amount"
                        name="nf-amount"
                        defaultValue={dataModal.amount}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Giá nhập */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-importPrice">Giá nhập</CLabel>
                      <CInput
                        type="text"
                        id="nf-importPrice"
                        name="nf-importPrice"
                        defaultValue={dataModal.importPrice}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giá bán */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-purchasePrice">Giá bán</CLabel>
                      <CInput
                        type="text"
                        id="nf-purchasePrice"
                        name="nf-purchasePrice"
                        defaultValue={dataModal.purchasePrice}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Đánh giá */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-rating">Đánh giá</CLabel>
                        <CInput
                          style={{ backgroundColor: COLORS.light }}
                          disabled
                          type="text"
                          id="nf-rating"
                          name="nf-rating"
                          defaultValue={dataModal.rating}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                  {/* Giảm giá */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-sale">Giảm giá</CLabel>
                      <CInput
                        type="text"
                        id="nf-sale"
                        name="nf-sale"
                        defaultValue={dataModal.sale}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Mô tả sản phẩm */}
                <CFormGroup>
                  <CLabel htmlFor="nf-description">Mô tả</CLabel>
                  <CTextarea
                    id="nf-description"
                    name="nf-description"
                    rows={4}
                    defaultValue={dataModal.description}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex align-items-center justify-content-between">
          <CButton
            color="danger"
            shape="pill"
            className="d-flex align-items-center"
            onClick={() => {
              setShowModalUpdateProd(false);
              setShowModalConfirm(true);
            }}
          >
            Xóa sản phẩm
          </CButton>
          <div>
            <CButton
              color="warning"
              shape="pill"
              style={{ color: COLORS.light }}
              onClick={() => setShowModalUpdateProd(!showModalUpdateProd)}
            >
              Cập nhật
            </CButton>{" "}
            <CButton
              color="secondary"
              shape="pill"
              onClick={() => setShowModalUpdateProd(!showModalUpdateProd)}
            >
              Hủy
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    );
  };

  // Modal xác nhận xóa
  const ConfirmDeleteModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalConfirm}
        onClose={() => setShowModalConfirm(!showModalConfirm)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn xác nhận muốn xóa sản phẩm này?</CModalBody>
        <CModalFooter>
          <CButton
            color="info"
            shape="pill"
            className="d-flex align-items-center"
            onClick={() => console.log("test")}
          >
            Tiếp tục
          </CButton>
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

  // hàm xử lý show modal khi click vào hàng trong bảng
  const handlerShowModal = (item) => {
    setDataModal({ ...dataModal, ...item });
    setShowModalUpdateProd(true);
  };

  return (
    <CCard style={{ ...borderCustom }}>
      <UpdateInfoProductModal />
      <ConfirmDeleteModal />
      <CCardHeader style={{ ...title }}>
        Danh sách sản phẩm trong kho
      </CCardHeader>
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
          onRowClick={(item) => handlerShowModal(item)}
        />
      </CCardBody>
    </CCard>
  );
};

export default Products;
