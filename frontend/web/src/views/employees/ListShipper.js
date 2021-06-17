import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  CButton,
  CDataTable,
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
  CTooltip,
} from "@coreui/react";
import { borderCustom } from "../../constants/common";
import COLORS from "src/constants/colors";
import { useSelector } from "react-redux";
import { SERVER_URL } from "src/config/config";

const ListShipper = (props, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shippers, setShippers] = useState([]);
  const [dataUpdateAccount, setDataUpdateAccount] = useState({
    shipperId: "",
    shipperCode: "",
    shipperName: "",
    avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    basicSalary: "",
    chatId: "",
    shopId: "",
    rating: 0,
  });
  const [showModalUpdateAccount, setShowModalUpdateAccount] = useState(false);
  const [idSelectedDelete, setIdSelectedDelete] = useState("");
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const admin = useSelector((state) => state.authReducer.admin);

  // Lấy danh sách người giao hàng
  const getShippers = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_URL}shippers?shopId=${admin.shopId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setShippers(resData.data);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          alert("Lỗi lấy danh sách shipper.");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải danh sách shipper: ${err}`);
    }
  }, [admin]);

  // Hàm theo dõi lấy danh sách shipper
  useEffect(() => {
    getShippers();
  }, [getShippers]);

  // Hàm thực hiện reload khi component cha yêu cầu
  useImperativeHandle(ref, () => {
    return {
      reload: async () => {
        await getShippers();
      },
    };
  });

  // Config các cột cho bảng dữ liệu
  const fields = [
    { key: "shipperCode", label: "Mã shipper/CCCD", _style: { width: "10%" } },
    { key: "shipperName", label: "Tên shipper", _style: { width: "25%" } },
    { key: "phoneNumber", label: "Số điện thoại", _style: { width: "10%" } },
    { key: "address", label: "Địa chỉ", _style: { width: "40%" } },
    { key: "email", label: "Email", _style: { width: "15%" } },
  ];

  // Hàm xử lý khi chọn 1 hàng
  const handlerClickRow = (item) => {
    setDataUpdateAccount({ ...dataUpdateAccount, ...item });
    setShowModalUpdateAccount(true);
  };

  // Modal cập nhật thông tin sản phẩm
  const UpdateInfoShipperModal = () => {
    const [shipperSelected, setShipperSelected] = useState({
      shipperId: dataUpdateAccount.shipperId,
      shipperCode: dataUpdateAccount.shipperCode,
      shipperName: "",
      avatar: dataUpdateAccount.avatar,
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      basicSalary: "",
      chatId: "",
      shopId: dataUpdateAccount.shopId,
    });
    const [validFormText, setValidFormText] = useState("");

    // check validate cho form cập nhật
    const checkValidForm = () => {
      var file = document.querySelector("input[id='imgShipper']").files[0];
      if (
        shipperSelected.shipperName ||
        shipperSelected.basicSalary ||
        shipperSelected.address ||
        file
      ) {
        const adminName = document.getElementById("nf-name").value;
        const basicSalary = document.getElementById("nf-basicSalary").value;
        const address = document.getElementById("nf-address").value;
        if (adminName && basicSalary && address) {
          setValidFormText("");
          return true;
        } else {
          setValidFormText(
            "Các trường bắt buộc không được để trống. Vui lòng nhập đầy đủ."
          );
          return false;
        }
      } else {
        setValidFormText("Bạn chưa thực sự thay đổi thông tin để cập nhật.");
        return false;
      }
    };

    // Hàm thực hiện thay đổi
    const handlerUpdateInfo = async () => {
      if (checkValidForm()) {
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          const avatarAdmin = document.querySelector("input[id='imgShipper']");
          formData.append("file", avatarAdmin.files[0]);
          formData.append(
            "shipper",
            JSON.stringify({
              shipperId: shipperSelected.shipperId,
              shipperName: shipperSelected.shipperName,
              basicSalary: shipperSelected.basicSalary,
              address: shipperSelected.address,
            })
          );
          const response = await fetch(
            `${SERVER_URL}shippers`,
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
              await getShippers();
              setShowModalUpdateAccount(!showModalUpdateAccount);
              break;
            default:
              alert("Có lỗi xảy ra khi cập nhật thông tin shipper.");
              break;
          }
        } catch (err) {
          alert(`Có lỗi xảy ra khi cập nhật thông tin shipper: ${err}.`);
        }
      }
    };

    // Hàm xử lý hiển thị khi chọn ảnh mới
    const previewFile = () => {
      setShipperSelected({
        ...shipperSelected,
        avatar: "",
      });
      var file = document.querySelector("input[id='imgShipper']").files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setShipperSelected({
          ...shipperSelected,
          avatar: reader.result,
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setShipperSelected({
          ...shipperSelected,
          avatar: "https://image.flaticon.com/icons/png/512/16/16410.png",
        });
      }
    };

    // Hàm gọi để xử lý chọn file ảnh
    const chooseImgHanler = () => {
      const imageFile = document.getElementById("imgShipper");
      imageFile.click();
    };

    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalUpdateAccount}
        onClose={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
        size="lg"
        color="warning"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cập nhật thông tin shipper</CModalTitle>
        </CModalHeader>
        <CModalBody className="pb-5">
          <CForm action="" method="post">
            <CRow>
              <CCol md="3">
                {/* Ảnh mẫu đại diện tài khoản */}
                <CImg
                  src={shipperSelected.avatar}
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
                  id="imgShipper"
                />
              </CCol>
              <CCol md="9">
                <CRow>
                  <CCol>
                    {/* Tên shipper */}
                    <CFormGroup>
                      <CLabel htmlFor="nf-name">
                        Tên shipper <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="text"
                        id="nf-name"
                        name="nf-name"
                        placeholder="Nhập tên shipper"
                        defaultValue={dataUpdateAccount.shipperName}
                        onChange={(event) =>
                          setShipperSelected({
                            ...shipperSelected,
                            shipperName: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    {/* Mã shipper */}
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-code">
                          Mã shipper/CMND{" "}
                          <span className="text-danger">(*)</span>
                        </CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="text"
                          id="nf-code"
                          name="nf-code"
                          placeholder="Nhập mã shipper"
                          defaultValue={dataUpdateAccount.shipperCode}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    {/* Email */}
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-email">
                          Email <span className="text-danger">(*)</span>
                        </CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="email"
                          id="nf-email"
                          name="nf-email"
                          placeholder="Nhập email"
                          defaultValue={dataUpdateAccount.email}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                  <CCol>
                    {/* Đánh giá */}
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-rating">Đánh giá </CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="text"
                          id="nf-rating"
                          name="nf-rating"
                          placeholder="Đánh giá"
                          defaultValue={dataUpdateAccount.rating}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                </CRow>
                <CRow>
                  {/* Số điện thoại */}
                  <CCol>
                    <CTooltip
                      content="Trường này không được phép cập nhật"
                      placement="right-end"
                    >
                      <CFormGroup>
                        <CLabel htmlFor="nf-phone">
                          Số điện thoại <span className="text-danger">(*)</span>
                        </CLabel>
                        <CInput
                          disabled
                          style={{ backgroundColor: COLORS.light }}
                          type="number"
                          min={0}
                          id="nf-phone"
                          name="nf-phone"
                          placeholder="Nhập số điện thoại"
                          defaultValue={dataUpdateAccount.phoneNumber}
                        />
                      </CFormGroup>
                    </CTooltip>
                  </CCol>
                  {/* Lương cơ bản */}
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="nf-basicSalary">
                        Lương cơ bản <span className="text-danger">(*)</span>
                      </CLabel>
                      <CInput
                        type="number"
                        step={10000}
                        min={0}
                        id="nf-basicSalary"
                        name="nf-basicSalary"
                        placeholder="Nhập lương cơ bản"
                        defaultValue={dataUpdateAccount.basicSalary}
                        onChange={(event) =>
                          setShipperSelected({
                            ...shipperSelected,
                            basicSalary: event.target.value,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                {/* Địa chỉ */}
                <CFormGroup>
                  <CLabel htmlFor="nf-address">
                    Địa chỉ <span className="text-danger">(*)</span>
                  </CLabel>
                  <CInput
                    type="text"
                    id="nf-address"
                    name="nf-address"
                    placeholder="Nhập địa chỉ"
                    defaultValue={dataUpdateAccount.address}
                    onChange={(event) =>
                      setShipperSelected({
                        ...shipperSelected,
                        address: event.target.value,
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
            {validFormText}
          </div>
        </CModalBody>
        <CModalFooter className="d-flex align-items-center justify-content-between">
          <CButton
            color="danger"
            shape="pill"
            className="d-flex align-items-center"
            onClick={() => {
              setShowModalUpdateAccount(false);
              setIdSelectedDelete(shipperSelected.shipperId);
              setShowModalConfirm(true);
            }}
          >
            Xóa tài khoản
          </CButton>
          <div>
            <CButton
              color="warning"
              className="mr-2"
              style={{ color: COLORS.light }}
              shape="pill"
              onClick={handlerUpdateInfo}
            >
              Cập nhật
            </CButton>
            <CButton
              color="secondary"
              shape="pill"
              onClick={() => setShowModalUpdateAccount(!showModalUpdateAccount)}
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
    // Hàm thực hiện xóa nhân viên
    const handlerDeleteAccount = async () => {
      try {
        //thực hiện xóa
        const token = localStorage.getItem("token");
        const response = await fetch(`${SERVER_URL}shippers`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            shipperId: idSelectedDelete,
            roleAction: admin.role,
          }),
        });
        setIdSelectedDelete("");
        setShowModalConfirm(!showModalConfirm);
        switch (response.status) {
          case 200:
            await getShippers();
            break;
          case 401:
            alert("Bạn không có quyền thực hiện hành động này.");
            break;
          default:
            alert("Lỗi không thể xóa shipper này.");
            break;
        }
      } catch (err) {
        alert("Lỗi không thể xóa shipper này: " + err);
      }
    };
    return (
      <CModal
        style={{ ...borderCustom }}
        show={showModalConfirm}
        onClose={() => {
          setIdSelectedDelete("");
          setShowModalConfirm(!showModalConfirm);
        }}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Bạn xác nhận muốn xóa tài khoản của shipper này?
        </CModalBody>
        <CModalFooter>
          <CButton
            color="info"
            shape="pill"
            className="d-flex align-items-center"
            onClick={handlerDeleteAccount}
          >
            Tiếp tục
          </CButton>
          <CButton
            color="secondary"
            shape="pill"
            onClose={() => {
              setIdSelectedDelete("");
              setShowModalConfirm(!showModalConfirm);
            }}
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
    <>
      <UpdateInfoShipperModal />
      <ConfirmDeleteModal />
      <CDataTable
        items={shippers}
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
      />
    </>
  );
};

export default forwardRef(ListShipper);
