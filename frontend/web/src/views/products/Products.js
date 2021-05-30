import React, { useState, useEffect, useCallback } from "react";
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
  CSelect,
  CSpinner,
} from "@coreui/react";
// import COLORS from "../../constants/colors";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";
import { fomatMoney } from "../../utils/Common";

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  });
  const [dataProducts, setDataProducts] = useState([]);
  const cates = useSelector((state) => state.constantReducer.cates);

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

  // Hàm lấy tên loại sản phẩm
  const getCateName = (cateId) => {
    const cateFinded = cates.find((item) => item.categoryId === cateId);
    return cateFinded.categoryName;
  };

  // Modal cập nhật thông tin sản phẩm
  const UpdateInfoProductModal = () => {
    const [data, setData] = useState({
      productId: dataModal.productId,
      productName: "",
      description: "",
      unit: "",
      imageUrl: dataModal.imageUrl,
      importPrice: "",
      purchasePrice: "",
      amount: "",
      quantitySold: "",
      dateOfImport: "",
      rating: "",
      sale: 0,
      shopId: "",
      categoryId: "",
      haveImport: false,
    });
    const [validFormUpdate, setValidFormUpdate] = useState("");

    // Hàm xử lý hiển thị khi chọn file
    const previewFile = () => {
      setData({ ...data, imageUrl: "" });
      // hiển thị ảnh
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setData({ ...data, imageUrl: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setData({
          ...data,
          imageUrl: "https://image.flaticon.com/icons/png/512/16/16410.png",
        });
      }
    };

    // Hàm xử lý mở chọn file ảnh
    const chooseImgHanler = () => {
      const imageFile = document.getElementById("imgProd");
      imageFile.click();
    };

    // Hàm check validate cho form cập nhật sản phẩm
    const checkValidFormUpdate = () => {
      const prodName = document.getElementById("nf-name").value;
      const cateId = document.getElementById("nf-cate").value;
      const unit = document.getElementById("nf-unit").value;
      const amount = document.getElementById("nf-amount").value;
      const importPrice = document.getElementById("nf-importPrice").value;
      const purchasePrice = document.getElementById("nf-purchasePrice").value;
      const sale = document.getElementById("nf-sale").value;
      if (
        prodName &&
        cateId &&
        unit &&
        amount &&
        importPrice &&
        purchasePrice &&
        sale
      ) {
        if(+importPrice < +purchasePrice){
          setValidFormUpdate("");
          return true;
        }else{
          setValidFormUpdate("Số tiền nhập phải bé hơn số tiền bán");
          return false;
        }
      } else {
        setValidFormUpdate("Vui lòng nhập đầy đủ các trường bắt buộc.");
        return true;
      }
    };

    // Hàm cập nhật thông tin sản phẩm
    const handlerUpdateInfo = async () => {
      if (checkValidFormUpdate()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector("input[type=file]");
          formData.append("file", productImage.files[0]);
          formData.append(
            "product",
            JSON.stringify({
              productId: data.productId,
              productName: data.productName,
              description: data.description,
              unit: data.unit,
              importPrice: data.importPrice,
              purchasePrice: data.purchasePrice,
              amount: data.amount,
              quantitySold: data.quantitySold,
              rating: data.rating,
              categoryId: data.categoryId,
              sale: data.sale,
              token: token,
            })
          );
          const response = await fetch(
            `http://192.168.1.125:3000/api/admin/products`,
            {
              method: "PUT",
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
              setShowModalUpdateProd(!showModalUpdateProd);
              return;
            default:
              alert("Lỗi không cập nhật được thông tin sản phẩm");
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
        show={showModalUpdateProd}
        onClose={() => setShowModalUpdateProd(!showModalUpdateProd)}
        size="lg"
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-4">
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh sản phẩm */}
                <CImg
                  src={data.imageUrl}
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
                {/* Tên sản phẩm */}
                <CFormGroup>
                  <CLabel htmlFor="nf-name">
                    Tên sản phẩm <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-name"
                    name="nf-name"
                    required
                    defaultValue={dataModal.productName}
                    onChange={(event) =>
                      setData({ ...data, productName: event.target.value })
                    }
                  />
                </CFormGroup>
                <CRow>
                  {/* Mã SP */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-code">
                          Mã sản phẩm <span className="text-danger">(*)</span>
                        </CLabel>
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
                        defaultValue={dataModal.categoryId}
                        onChange={(event) =>
                          setData({ ...data, categoryId: event.target.value })
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
                </CRow>
                <CRow>
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
                        required
                        defaultValue={dataModal.unit}
                        onChange={(event) =>
                          setData({ ...data, unit: event.target.value })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Số lượng còn */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-amount">
                        Số lượng trong kho{" "}
                        <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        id="nf-amount"
                        name="nf-amount"
                        required
                        defaultValue={dataModal.amount}
                        onChange={(event) =>
                          setData({ ...data, amount: event.target.value })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Giá nhập */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-importPrice">
                        Giá nhập <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        step={1000}
                        id="nf-importPrice"
                        name="nf-importPrice"
                        required
                        defaultValue={dataModal.importPrice}
                        onChange={(event) =>
                          setData({ ...data, importPrice: event.target.value })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Giá bán */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-purchasePrice">
                        Giá bán <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        step={1000}
                        id="nf-purchasePrice"
                        name="nf-purchasePrice"
                        required
                        defaultValue={dataModal.purchasePrice}
                        onChange={(event) =>
                          setData({
                            ...data,
                            purchasePrice: event.target.value,
                          })
                        }
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
                        <CLabel htmlFor="nf-rating">
                          Đánh giá <span className="text-danger">(*)</span>
                        </CLabel>
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
                      <CLabel htmlFor="nf-sale">
                        Giảm giá <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        min={0}
                        id="nf-sale"
                        name="nf-sale"
                        required
                        defaultValue={dataModal.sale}
                        onChange={(event) =>
                          setData({ ...data, sale: event.target.value })
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
                    rows={4}
                    defaultValue={dataModal.description}
                    onChange={(event) =>
                      setData({ ...data, description: event.target.value })
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
            {validFormUpdate}
          </div>
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
              onClick={handlerUpdateInfo}
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
    // Hàm thực hiện xóa sản phẩm
    const deleteProduct = async () => {
      if(dataModal.productId){
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://192.168.1.125:3000/api/products/${dataModal.productId}`,
            {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token,
              },
            }
          );
          switch (response.status) {
            case 200:
              await getProducts();
              setShowModalConfirm(!showModalConfirm);
              return;
            default:
              alert("Lỗi không cập nhật được thông tin sản phẩm");
              return;
          }
        } catch (err) {
          alert(`Lỗi xóa sản phẩm: ${err}`);
        }
      }else{
        alert("Không lấy được id sản phẩm")
      }
    }

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
            onClick={deleteProduct}
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
      <UpdateInfoProductModal />
      <ConfirmDeleteModal />
      <CCardHeader style={{ ...title }}>
        Danh sách sản phẩm trong kho
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
          onRowClick={(item) => handlerShowModal(item)}
          scopedSlots={{
            categoryName: (item) => <td>{getCateName(item.categoryId)}</td>,
            importPrice: (item) => <td>{fomatMoney(item.importPrice)}</td>,
            purchasePrice: (item) => <td>{fomatMoney(item.purchasePrice)}</td>,
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default Products;
