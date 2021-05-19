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
  CImg,
  CButton,
  CFormGroup,
  CLabel,
  CInputFile,
  CInput,
  CModalFooter,
  CTextarea,
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import CIcon from "@coreui/icons-react";
import COLORS from "src/constants/colors";

const ImportProducts = () => {
  const [showModalImportNew, setShowModalImportNew] = useState(false);
  const [showModalImportMore, setShowModalImportMore] = useState(false);
  const [dataImportMore, setDataImportMore] = useState({
    productCode: "",
    productName: "",
    imageUrl: "",
    amount: 0,
    unit: "",
    amountImport: 0,
    categoryName: "",
  });
  const [dataImportNew, setDataImportNew] = useState({
    productId: "",
    productCode: "",
    productName: "",
    description: "",
    unit: "",
    imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
    importPrice: "",
    purchasePrice: "",
    amount: "",
    quantitySold: "",
    dateOfImport: "",
    rating: "",
    sale: 0,
    shopId: "",
    categoryId: "",
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
      _style: { width: "30%" },
    },
    {
      key: "unit",
      label: "Đơn vị",
      _style: { width: "7%" },
    },
    {
      key: "categoryName",
      label: "Loại",
      _style: { width: "8%" },
    },
    {
      key: "importPrice",
      label: "Giá nhập",
      _style: { width: "10%" },
    },
    {
      key: "amount",
      label: "SL còn",
      _style: { width: "10%" },
    },
    {
      key: "dateOfImport",
      label: "Nhập gần nhất",
      _style: { width: "20%" },
    },
  ];

  // Hàm xử lý hiển thị ảnh demo khi chọn ảnh ms
  const previewFile = () => {
    setDataImportNew({
      ...dataImportNew,
      imageUrl: "",
    });
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setDataImportNew({
        ...dataImportNew,
        imageUrl: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setDataImportNew({
        ...dataImportNew,
        imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
      });
    }
  };

  // Hàm gọi để xử lý chọn file ảnh
  const chooseImgHanler = () => {
    const imageFile = document.getElementById("imgProd");
    imageFile.click();
  };

  // Hàm xử lý khi click vào từng dòng để nhập thêm sản phẩm
  const handlerClickRow = (item) => {
    setDataImportMore({ ...dataImportMore, ...item });
    setShowModalImportMore(true);
  };

  // Modal nhập sản phẩm mới
  const ImportNewProductModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalImportNew}
        onClose={() => setShowModalImportNew(!showModalImportNew)}
        size="lg"
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Nhập sản phẩm mới</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu sản phẩm */}
                <CImg
                  src={dataImportNew.imageUrl}
                  style={{ borderRadius: 15, width: "100%" }}
                />
                {/* Chọn ảnh từ máy */}
                <div className="w-100 d-flex justify-content-center mt-2">
                  <CButton
                    className="btn-pill mx-auto"
                    color="success"
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
                {/* Tên sản phẩm */}
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Tên sản phẩm</CLabel>
                  <CInput
                    type="text"
                    id="nf-name"
                    name="nf-name"
                    placeholder="Nhập tên sản phẩm"
                    defaultValue={dataImportNew.categoryName}
                  />
                </CFormGroup>
                <CRow>
                  {/* Loại sản phẩm */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-cate">Loại sản phẩm</CLabel>
                      <CInput
                        type="text"
                        id="nf-cate"
                        name="nf-cate"
                        defaultValue={dataImportNew.categoryName}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Đơn vị */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-unit">Đơn vị</CLabel>
                      <CInput
                        type="text"
                        id="nf-unit"
                        name="nf-unit"
                        placeholder="Nhập tên đơn vị"
                        defaultValue={dataImportNew.unit}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Số lượng còn */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-amount">Số lượng nhập</CLabel>
                      <CInput
                        type="number"
                        id="nf-amount"
                        name="nf-amount"
                        placeholder="Nhập số lượng nhập"
                        defaultValue={dataImportNew.amount}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giá nhập */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-importPrice">Giá nhập</CLabel>
                      <CInput
                        type="text"
                        id="nf-importPrice"
                        name="nf-importPrice"
                        placeholder="Nhập giá nhập"
                        defaultValue={dataImportNew.importPrice}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Giá bán */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-purchasePrice">Giá bán</CLabel>
                      <CInput
                        type="text"
                        id="nf-purchasePrice"
                        name="nf-purchasePrice"
                        placeholder="Nhập giá bán"
                        defaultValue={dataImportNew.purchasePrice}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giảm giá */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-sale">Giảm giá</CLabel>
                      <CInput
                        type="text"
                        id="nf-sale"
                        name="nf-sale"
                        defaultValue={dataImportNew.sale}
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
                    placeholder="Nhập mô tả cho sản phẩm"
                    rows={4}
                    defaultValue={dataImportNew.description}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            style={{color: COLORS.light}}
            shape="pill"
            onClick={() => setShowModalImportNew(!showModalImportNew)}
          >
            Nhập mới
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalImportNew(!showModalImportNew)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // Modal nhập thêm sản phẩm đã có trong kho
  const ImportMoreProductModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalImportMore}
        onClose={() => setShowModalImportMore(!showModalImportMore)}
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Nhập thêm sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Ảnh minh họa sản phẩm */}
          <div className="d-flex justify-content-center">
            <CImg
              src={dataImportMore.imageUrl}
              className="border"
              style={{ borderRadius: 15, width: "35%" }}
            />
          </div>
          {/* Thông tin sản phẩm */}
          <div className="mt-4">
            {/* Tên sản phẩm */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-fastfood"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Tên sản phẩm:</strong>
              </CCol>
              <CCol md="7">{dataImportMore.productName}</CCol>
            </CRow>
            {/* Mã sản phẩm */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-code" className="mr-2" color={COLORS.dark} />
                <strong>Mã sản phẩm:</strong>
              </CCol>
              <CCol md="7">{dataImportMore.productCode}</CCol>
            </CRow>
            {/* Loại sản phẩm */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-featured-playlist"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Loại:</strong>
              </CCol>
              <CCol md="7">{dataImportMore.categoryName}</CCol>
            </CRow>
            {/* Đơn vị */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-balance-scale"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Đơn vị:</strong>
              </CCol>
              <CCol md="7">{dataImportMore.unit}</CCol>
            </CRow>
            {/* Số lượng trong kho */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-house" className="mr-2" color={COLORS.dark} />
                <strong>Số lượng trong kho:</strong>
              </CCol>
              <CCol md="7">{dataImportMore.amount}</CCol>
            </CRow>
          </div>
          <CForm action="" method="post">
            <CFormGroup className="mt-2">
              <CLabel htmlFor="nf-amountImport" style={{ fontWeight: "bold" }}>
                Số lượng nhập thêm
              </CLabel>
              <CInput
                type="number"
                id="nf-amountImport"
                name="nf-amountImport"
                placeholder="Nhập số lượng nhập thêm"
                min={0}
                style={{ textAlign: "right" }}
                defaultValue={dataImportMore.amountImport}
              />
            </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            shape="pill"
            onClick={() => setShowModalImportMore(!showModalImportMore)}
          >
            Nhập thêm
          </CButton>{" "}
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalImportMore(!showModalImportMore)}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <CCard style={{ ...borderCustom }}>
      <ImportNewProductModal />
      <ImportMoreProductModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Quản lý nhập</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => setShowModalImportNew(true)}
        >
          Nhập sản phẩm mới
        </CButton>
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
          onRowClick={(item) => handlerClickRow(item)}
        />
      </CCardBody>
    </CCard>
  );
};

export default ImportProducts;
