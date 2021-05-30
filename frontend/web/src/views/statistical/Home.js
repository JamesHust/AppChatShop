import React, { lazy, useCallback, useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import MonitorOrdersChart from "./MonitorOrdersChart";
import MonitorCateChart from "./MonitorCateChart";
import RevenueChart from "./RevenueChart";
import COLORS from "src/constants/colors";
import InforShop from "./InforShop";
import { useSelector } from "react-redux";
const Widgets = lazy(() => import("./Widgets"));

const Home = () => {
  const [shopData, setShopData] = useState({
    shopId: "",
    shopCode: "",
    shopName: "",
    avatar: "",
    phoneNumber: "",
    otherPhoneNumber: "",
    address: "",
    email: "",
    openTime: "",
    closeTime: "",
    rating: 0,
    chatId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const admin = useSelector((state) => state.authReducer.admin);

  // Thực hiện lấy thông tin cửa hàng
  const getDataShop = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.125:3000/api/shops/${admin.shopId}`,
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
          setShopData(resData.data);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          alert("Lỗi lấy số thông tin cửa hàng");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Lỗi tải dữ liệu: ${err}`);
    }
  }, [admin]);

  // Hàm theo dõi để gọi lấy dữ liệu của trang
  useEffect(() => {
    getDataShop();
  }, [getDataShop]);

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
      <CRow>
        <CCol md="8">
          {/* Widgets theo dõi đơn đặt hàng trong ngày*/}
          <Widgets />
          {/* Biểu đồ theo dõi lượng mua hàng theo ngày, tuần tháng */}
          <CCard style={{ borderRadius: 15 }}>
            <CCardBody>
              <CRow>
                <CCol sm="5">
                  <h4 id="traffic" className="card-title mb-0">
                    Lượng đơn hàng
                  </h4>
                  <div className="small text-muted">15/05/2020</div>
                </CCol>
                <CCol sm="7" className="d-none d-md-block">
                  {/* Download biểu đồ thống kê */}
                  <CButton
                    style={{ backgroundColor: COLORS.light_blue_13 }}
                    className="float-right"
                  >
                    <CIcon
                      name="cil-cloud-download"
                      style={{ color: COLORS.light }}
                    />
                  </CButton>
                </CCol>
              </CRow>
              <MonitorOrdersChart
                style={{ height: "300px", marginTop: "40px" }}
              />
            </CCardBody>
          </CCard>
          <CCard style={{ borderRadius: 15, overflow: "hidden" }}>
            <CCardHeader style={{ fontWeight: "bold", fontSize: 18 }}>
              Doanh thu
            </CCardHeader>
            <CCardBody>
              <RevenueChart />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <MonitorCateChart />
          <InforShop data={shopData} reload={getDataShop}/>
        </CCol>
      </CRow>
    </>
  );
};

export default Home;
