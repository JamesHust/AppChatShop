import React, { useState, useEffect, useCallback } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CRow,
  CCol,
  CImg,
  CInputFile,
  CFormGroup,
  CLabel,
  CInput,
  CModalFooter,
  CSpinner,
  CDataTable,
} from "@coreui/react";
import { title, borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import CIcon from "@coreui/icons-react";

const CustomerArea = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listEmployee, setListEmployee] = useState([]);
  const [showModalAddAccount, setShowModalAddAccount] = useState(false);
  const [showModalDetailCus, setShowModalDetailCus] = useState(false);
  const [dataDetail, setDataImportMore] = useState({
    customerCode:"",//mã khách hàng
    customerName: "", //tên khách hàng
    avatar: "https://image.flaticon.com/icons/png/512/16/16410.png", //ảnh đại diện
    phoneNumber: "", //số điện thoại liên hệ
    address: "", //địa chỉ thường trú
    email: "", //địa chỉ email
    password: "", //mật khẩu
  });
  const areaId = localStorage.getItem("areaId");

  // Hàm lấy danh sách khách hàng trong khu vực
  const getListEmployeeArea = async (id) => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://192.168.1.125:3000/api/customers?areaId=${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setListEmployee(resData.data);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          setListEmployee([]);
          alert("Lỗi lấy danh sách khách hàng trong khu vực.");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải danh sách khách hàng trong khu vực: ${err}`);
    }
  };

  // Xử lý lấy dữ liệu danh sách khách hàng trong khu vực
  const getData = useCallback(async () => {
    await getListEmployeeArea(areaId);
  }, [areaId]);

  // Hàm theo dõi để lấy lại dữ liệu khách hàng
  useEffect(() => {
    getData();
  }, [getData]);

  // Hàm xử lý khi click vào từng dòng để nhập thêm sản phẩm
  const handlerClickRow = (item) => {
    setDataImportMore({ ...dataDetail, ...item });
    setShowModalDetailCus(true);
  };

  // Modal thêm khách hàng mới
  const ImportNewCustomerModal = () => {
    const [dataNewAccount, setDataNewAccount] = useState({
      customerName: "", //tên khách hàng
      avatar: "https://image.flaticon.com/icons/png/512/16/16410.png", //ảnh đại diện
      phoneNumber: "", //số điện thoại liên hệ
      otherPhoneNumber: "", //số điện thoại liên hệ khác
      address: "", //địa chỉ thường trú
      email: "", //địa chỉ email
      password: "", //mật khẩu
    });
    const [validTextImportNew, setValidTextImportNew] = useState("");

    // reset lại dữ liệu khi đóng form
    const resetData = () => {
      document.getElementById("imgCustomerNew").value = "";
      setDataNewAccount({
        customerName: "", //tên khách hàng
        avatar: "https://image.flaticon.com/icons/png/512/16/16410.png", //ảnh đại diện
        phoneNumber: "", //số điện thoại liên hệ
        address: "", //địa chỉ thường trú
        email: "", //địa chỉ email
        password: "", //mật khẩu
      });
    };

    // Hàm check validate các trường, form--sửa
    const checkValidImportNew = () => {
      var file = document.querySelector("input[id='imgCustomerNew']").files[0];
      if (file) {
        const customerName = document.getElementById("nf-nameNew").value;
        const phoneNumber = document.getElementById("nf-phoneNumber").value;
        const email = document.getElementById("nf-email").value;
        const password = document.getElementById("nf-passNew").value;
        const address = document.getElementById("nf-addressNew").value;
        if (customerName && phoneNumber && password && email && address) {
          // Validate mật khẩu
          const regexPass =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!regexPass.test(password)) {
            setValidTextImportNew(
              "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một ký tự và một số."
            );
            return false;
          }
          // Validate cho email
          const regexEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!regexEmail.test(email)) {
            setValidTextImportNew(
              "Email không đúng định dạng. Vui lòng nhập lại."
            );
            return false;
          }
          // Validate cho số điện thoại
          const regexPhone = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;
          if (!regexPhone.test(phoneNumber)) {
            setValidTextImportNew("Số điện thoại không hợp lệ.");
            return false;
          }
          setValidTextImportNew("");
          return true;
        } else {
          setValidTextImportNew(
            "Các trường bắt buộc không được phép để trống. Vui lòng nhập đầy đủ."
          );
          return false;
        }
      } else {
        setValidTextImportNew("Vui lòng chọn ảnh đại diện.");
        return false;
      }
    };

    // Hàm thực hiện thêm khách hàng mới
    const handlerInsertNew = async () => {
      if (checkValidImportNew()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const productImage = document.querySelector(
            "input[id='imgCustomerNew']"
          );
          formData.append("file", productImage.files[0]);
          formData.append(
            "customer",
            JSON.stringify({
              customerName: document.getElementById("nf-nameNew").value,
              phoneNumber: document.getElementById("nf-phoneNumber").value,
              email: document.getElementById("nf-email").value,
              password: document.getElementById("nf-passNew").value,
              address: document.getElementById("nf-addressNew").value,
              areaId: areaId,
            })
          );
          const response = await fetch(
            `http://192.168.1.125:3000/api/customers`,
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
              await getListEmployeeArea(areaId);
              setShowModalAddAccount(!showModalAddAccount);
              return;
            case 403:
              setValidTextImportNew("Email hoặc Số điện thoại đã bị trùng.");
              return;
            default:
              alert("Lỗi không cập nhật được thông tin sản phẩm");
              return;
          }
        } catch (err) {
          alert(`Lỗi thêm mới dữ liệu: ${err}`);
        }
      }
    };

    // Hàm xử lý hiển thị khi chọn ảnh mới
    const previewFile = () => {
      setDataNewAccount({
        ...dataNewAccount,
        avatar: "",
      });
      var file = document.querySelector("input[id='imgCustomerNew']").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setDataNewAccount({
          ...dataNewAccount,
          avatar: reader.result,
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setDataNewAccount({
          ...dataNewAccount,
          avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
        });
      }
    };

    // Hàm gọi để xử lý chọn file ảnh
    const chooseImgHanler = () => {
      const imageFile = document.getElementById("imgCustomerNew");
      imageFile.click();
    };

    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalAddAccount}
        onClose={() => {
          setShowModalAddAccount(!showModalAddAccount);
          resetData();
        }}
        size="lg"
        color="success"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thêm mới tài khoản khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-5">
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu đại diện tài khoản */}
                <CImg
                  src={dataNewAccount.avatar}
                  className="border"
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
                  id="imgCustomerNew"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  <CCol>
                    {/* Tên khách hàng */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-nameNew">
                        Tên khách hàng <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-nameNew"
                        name="nf-nameNew"
                        placeholder="Nhập tên khách hàng"
                        defaultValue={dataNewAccount.customerName}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Số điện thoại */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-phoneNumber">
                        Số điện thoại <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        style={{ backgroundColor: COLORS.light }}
                        type="text"
                        id="nf-phoneNumber"
                        name="nf-phoneNumber"
                        placeholder="Nhập số điện thoại"
                        defaultValue={dataNewAccount.phoneNumber}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  {/*Email*/}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-email">
                        Email <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="email"
                        id="nf-email"
                        name="nf-email"
                        placeholder="Nhập địa chỉ email"
                        defaultValue={dataNewAccount.email}
                      />
                    </CFormGroup>
                  </CCol>
                  {/* Mật khẩu */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-passNew">
                        Mật khẩu <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="password"
                        id="nf-passNew"
                        name="nf-passNew"
                        placeholder="Nhập mật khẩu"
                        defaultValue={dataNewAccount.password}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Địa chỉ */}
                <CFormGroup>
                  <CLabel htmlFor="nf-addressNew">
                    Địa chỉ <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-addressNew"
                    name="nf-addressNew"
                    placeholder="Nhập địa chỉ"
                    defaultValue={dataNewAccount.address}
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
            {validTextImportNew}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="mr-2"
            shape="pill"
            onClick={handlerInsertNew}
          >
            Thêm mới
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => {
              setShowModalAddAccount(!showModalAddAccount);
              resetData();
            }}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // Modal hiển thị thông tin chi tiết khách hàng
  const InforCustomerModal = () => {
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalDetailCus}
        onClose={() => setShowModalDetailCus(!showModalDetailCus)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thông tin khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-4">
          {/* Ảnh minh họa sản phẩm */}
          <div className="d-flex justify-content-center">
            <CImg
              src={dataDetail.avatar}
              className="border"
              style={{ borderRadius: 15, width: "35%" }}
            />
          </div>
          {/* Thông tin khách hàng */}
          <div className="mt-4">
            {/* Tên khách hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-fastfood"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Tên khách hàng:</strong>
              </CCol>
              <CCol md="7">{dataDetail.customerName}</CCol>
            </CRow>
            {/* Mã khách hàng */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-code" className="mr-2" color={COLORS.dark} />
                <strong>Mã khách hàng:</strong>
              </CCol>
              <CCol md="7">{dataDetail.customerCode}</CCol>
            </CRow>
            {/* Số điện thoại */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-featured-playlist"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số điện thoại:</strong>
              </CCol>
              <CCol md="7">{dataDetail.phoneNumber}</CCol>
            </CRow>
            {/* Số điện thoại khác */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon
                  name="cil-balance-scale"
                  className="mr-2"
                  color={COLORS.dark}
                />
                <strong>Số điện thoại khác:</strong>
              </CCol>
              <CCol md="7">{dataDetail.otherPhoneNumber ? dataDetail.otherPhoneNumber : "Không có"}</CCol>
            </CRow>
            {/* Email */}
            <CRow className="mb-3">
              <CCol md="5" className="d-flex align-items-center">
                <CIcon name="cil-house" className="mr-2" color={COLORS.dark} />
                <strong>Email:</strong>
              </CCol>
              <CCol md="7">{dataDetail.email}</CCol>
            </CRow>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            shape="pill"
            onClick={() => setShowModalDetailCus(!showModalDetailCus)}
          >
            Ok
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // header của trang
  const Header = () => {
    return (
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <div style={{ ...title }}>Khách hàng khu vực</div>
        <CButton
          color="success"
          shape="pill"
          onClick={() => {
            // document.getElementById("imgEmployeeNew").value = "";
            document.getElementById("imgCustomerNew").value = "";
            setShowModalAddAccount(true);
          }}
        >
          Thêm mới khách hàng
        </CButton>
      </CCardHeader>
    );
  };

  // Config các cột cho bảng dữ liệu
  const fields = [
    { key: "customerCode", label: "Mã KH", _style: { width: "10%" } },
    { key: "customerName", label: "Tên khách hàng", _style: { width: "20%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "20%" } },
    {
      key: "otherPhoneNumber",
      label: "Số điện thoại khác",
      _style: { width: "20%" },
    },
    { key: "address", label: "Địa chỉ", _style: { width: "30%" } },
  ];

  // Trường hợp chưa load được dữ liệu
  if (isLoading) {
    return (
      <CCard style={{ ...borderCustom }}>
        <Header />
        <CCardBody>
          <div className="d-flex justify-content-center align-items-center w-100 pt-5">
            <CSpinner color="info" />
          </div>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard style={{ ...borderCustom }}>
      <ImportNewCustomerModal />
      <InforCustomerModal/>
      <Header />
      <CCardBody>
        <CDataTable
          items={listEmployee}
          fields={fields}
          columnFilter
          tableFilter
          footer
          itemsPerPageSelect
          itemsPerPage={5}
          hover
          sorter
          pagination
          onRowClick={(item) => handlerClickRow(item)}
          scopedSlots={{
            otherPhoneNumber: (item) => <td>{item.otherPhoneNumber ? item.otherPhoneNumber : "Không có"}</td>,
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default CustomerArea;
