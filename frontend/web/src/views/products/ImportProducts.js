import React, { useState, useCallback, useEffect } from "react";
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
  CSpinner,
  CSelect,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { fomatMoney, formatDateTime } from "../../utils/Common";
import { title, borderCustom } from "../../constants/common";
import CIcon from "@coreui/icons-react";
import COLORS from "src/constants/colors";

const ImportProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModalImportNew, setShowModalImportNew] = useState(false);
  const [showModalImportMore, setShowModalImportMore] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataImportMore, setDataImportMore] = useState({
    productId: "",
    productCode: "",
    productName: "",
    imageUrl: "",
    amount: 0,
    unit: "",
    amountImport: 0,
    categoryId: "",
  });
  const cates = useSelector((state) => state.constantReducer.cates);
  const admin = useSelector((state) => state.authReducer.admin);
  // Hàm lấy dữ liệu toàn bộ sản phẩm
  const getProducts = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const response = await fetch(`http://192.168.1.125:3000/api/products`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setDataProducts(resData.data);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          alert("Lỗi lấy số thông tin sản phẩm");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải dữ liệu: ${err}`);
    }
  }, []);

  // Hàm gọi tới hàm lấy dữ liệu
  useEffect(() => {
    getProducts();
  }, [getProducts]);

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

  // Hàm lấy tên loại sản phẩm
  const getCateName = (cateId) => {
    if (cateId) {
      const cateFinded = cates.find((item) => item.categoryId === cateId);
      return cateFinded.categoryName;
    } else return "";
  };

  // Hàm xử lý khi click vào từng dòng để nhập thêm sản phẩm
  const handlerClickRow = (item) => {
    setDataImportMore({ ...dataImportMore, ...item });
    setShowModalImportMore(true);
  };

  // Modal nhập sản phẩm mới
  const ImportNewProductModal = () => {
    const [newProduct, setNewProduct] = useState({
      imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
      productName: "",
      description: "",
      unit: "",
      importPrice: "",
      purchasePrice: "",
      amount: "",
      quantitySold: "0",
      rating: 0.0,
      sale: 0,
      shopId: admin.shopId,
      categoryId: cates[0].categoryId,
    });
    const [validFormImportNew, setValidFormImportNew] = useState("");

    // Hàm xử lý hiển thị ảnh demo khi chọn ảnh ms
    const previewFile = () => {
      setNewProduct({
        ...newProduct,
        imageUrl: "",
      });
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setNewProduct({
          ...newProduct,
          imageUrl: reader.result,
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setNewProduct({
          ...newProduct,
          imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
        });
      }
    };

    // Hàm gọi để xử lý chọn file ảnh
    const chooseImgHanler = () => {
      const imageFile = document.getElementById("imgProd");
      imageFile.click();
    };

    // Hàm check validate cho form thêm mới sản phẩm
    const checkValidFormImportNew = () => {
      const imageFile = document.querySelector("input[type=file]");
      if (imageFile.files[0]) {
        setValidFormImportNew("");
        console.log(newProduct);
        if (
          newProduct.productName &&
          newProduct.unit &&
          newProduct.importPrice &&
          newProduct.purchasePrice &&
          newProduct.amount &&
          newProduct.shopId &&
          newProduct.categoryId &&
          newProduct.shopId
        ) {
          if(+newProduct.importPrice < +newProduct.purchasePrice){
            setValidFormImportNew("");
            return true;
          }else{
            setValidFormImportNew("Số tiền nhập phải bé hơn số tiền bán");
            return false;
          }
        } else {
          setValidFormImportNew("Vui lòng nhập đầy đủ các trường bắt buộc.");
          return false;
        }
      } else {
        setValidFormImportNew("Vui lòng chọn ảnh sản phẩm cần thêm.");
        return false;
      }
    };

    // Hàm xử lý request gửi đi
    const handlerImportNewProduct = async () => {
      if (checkValidFormImportNew()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector('input[type="file"]');
          formData.append("file", productImage.files[0]);
          formData.append(
            "product",
            JSON.stringify({
              productName: newProduct.productName,
              description: newProduct.description,
              unit: newProduct.unit,
              importPrice: newProduct.importPrice,
              purchasePrice: newProduct.purchasePrice,
              amount: newProduct.amount,
              quantitySold: newProduct.quantitySold,
              rating: newProduct.rating,
              categoryId: newProduct.categoryId,
              shopId: newProduct.shopId,
              sale: newProduct.sale,
            })
          );
          const response = await fetch(
            `http://192.168.1.125:3000/api/products`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "x-access-token": token,
              },
              body: formData,
            }
          );
          switch (response.status) {
            case 200:
              await getProducts();
              setShowModalImportNew(!showModalImportNew);
              return;
            default:
              alert("Lỗi không thêm mới được sản phẩm");
              return;
          }
        } catch (err) {
          alert(`Lỗi tải dữ liệu: ${err}`);
        }
      }
    };

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
        <CModalBody className="pb-4">
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu sản phẩm */}
                <CImg
                  src={newProduct.imageUrl}
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
                  <CLabel htmlFor="nf-name">
                    Tên sản phẩm <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-name"
                    name="nf-name"
                    placeholder="Nhập tên sản phẩm"
                    defaultValue={newProduct.productName}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        productName: event.target.value,
                      })
                    }
                  />
                </CFormGroup>
                <CRow>
                  {/* Loại sản phẩm */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-cate">
                        Loại sản phẩm <span className="text-danger">(*)</span>
                      </CLabel>
                      <CSelect
                        id="nf-cate"
                        name="nf-cate"
                        aria-label="Chọn loại sản phẩm"
                        defaultValue={cates[0].categoryId}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            categoryId: event.target.value,
                          })
                        }
                      >
                        {cates.map((item) => (
                          <option value={item.categoryId} key={item.categoryId}>
                            {item.categoryName}
                          </option>
                        ))}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  {/* Đơn vị */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-unit">
                        Đơn vị <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-unit"
                        name="nf-unit"
                        placeholder="Nhập tên đơn vị"
                        defaultValue={newProduct.unit}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            unit: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Số lượng còn */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-amount">
                        Số lượng nhập <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        id="nf-amount"
                        name="nf-amount"
                        placeholder="Nhập số lượng nhập"
                        defaultValue={newProduct.amount}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            amount: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giá nhập */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-importPrice">
                        Giá nhập <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        step={1000}
                        min={0}
                        id="nf-importPrice"
                        name="nf-importPrice"
                        placeholder="Nhập giá nhập"
                        defaultValue={newProduct.importPrice}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            importPrice: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Giá bán */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-purchasePrice">
                        Giá bán <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        step={1000}
                        min={0}
                        id="nf-purchasePrice"
                        name="nf-purchasePrice"
                        placeholder="Nhập giá bán"
                        defaultValue={newProduct.purchasePrice}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            purchasePrice: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giảm giá */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-sale">
                        Giảm giá <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        id="nf-sale"
                        name="nf-sale"
                        defaultValue={newProduct.sale}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            sale: event.target.value,
                          })
                        }
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
                    defaultValue={newProduct.description}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        description: event.target.value,
                      })
                    }
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CForm>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 215,
              color: "red",
              width: "82%",
            }}
          >
            {validFormImportNew}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            style={{ color: COLORS.light }}
            shape="pill"
            onClick={handlerImportNewProduct}
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
    const [importAmount, setImportAmount] = useState();
    const [notificationValid, setNotificationValid] = useState();
    const handlerImportMore = async () => {
      try {
        if (importAmount) {
          setNotificationValid("");
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://192.168.1.125:3000/api/admin/import`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "x-access-token": token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productId: dataImportMore.productId,
                importAmount: importAmount,
              }),
            }
          );
          switch (response.status) {
            case 200:
              await getProducts();
              setShowModalImportMore(!showModalImportMore);
              return;
            default:
              alert("Lỗi không nhập thêm được sản phẩm");
              return;
          }
        } else {
          setNotificationValid("Vui lòng nhập số lượng lớn hơn 0.");
        }
      } catch (err) {
        setNotificationValid("");
        alert(`Lỗi tải dữ liệu: ${err}`);
      }
    };

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
        <CModalBody className="pb-4">
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
              <CCol md="7">{getCateName(dataImportMore.categoryId)}</CCol>
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
                onChange={(e) => setImportAmount(e.target.value)}
              />
            </CFormGroup>
          </CForm>
          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 16,
              color: "red",
              width: "82%",
            }}
          >
            {notificationValid}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" shape="pill" onClick={handlerImportMore}>
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

  // Trường hợp chưa load được dữ liệu
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100">
        <CSpinner color="info" />
      </div>
    );
  }

  return (
    <CCard style={{ ...borderCustom }}>
      <ImportNewProductModal />
      <ImportMoreProductModal />
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Quản lý nhập</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => {
            document.getElementById("imgProd").value = "";
            setShowModalImportNew(true);
          }}
        >
          Nhập sản phẩm mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={dataProducts}
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
          scopedSlots={{
            categoryName: (item) => <td>{getCateName(item.categoryId)}</td>,
            importPrice: (item) => <td>{fomatMoney(item.importPrice)}</td>,
            dateOfImport: (item) => (
              <td>{formatDateTime(item.dateOfImport)}</td>
            ),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default ImportProducts;
