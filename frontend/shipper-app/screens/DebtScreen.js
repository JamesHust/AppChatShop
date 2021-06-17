import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import COLORS from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import debt from "../data/debt";
import history from "../data/history";
import cancel from "../data/cancel_orders";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatShowDate, addDotToNumber, showToast } from "../utils/Common";
import configData from "../config/config.json";

const DebtScreen = (props) => {
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [isCollapseHistory, setIsCollapseHistory] = useState(true);
  const [isCollapseDebt, setIsCollapseDebt] = useState(false);
  const [isCollapseCancelOrder, setIsCollapseCancelOrder] = useState(true);
  const [debtData, setDebtData] = useState();
  const [historyData, setHistoryData] = useState();
  const [cancelOrderData, setCancelOrderData] = useState();
  const shipper = useSelector(state => state.authReducer.shipper);

  // Làm lấy dữ liệu công nợ phải trả cho cửa hàng
  const getDebtData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const shipperId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `${configData.SERVER_URL}debt/delivery?shopId=${shipper.shopId}&shipperId=${shipperId}`,
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
          setDebtData(resData.data);
          return;
        default:
          setDebtData(null);
          return;
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getDebtData(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Làm lấy dữ liệu công nợ phải trả cho cửa hàng
  const getCancelOrderData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const shipperId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `${configData.SERVER_URL}detail/delivery?shopId=${shipper.shopId}&shipperId=${shipperId}`,
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
          setCancelOrderData(resData.data);
          return;
        default:
          setCancelOrderData(null);
          return;
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getCancelOrderData(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Lấy lịch sử giao hàng thành công trong ngày
  const getHistoryData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const shipperId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `${configData.SERVER_URL}history/delivery?shopId=${shipper.shopId}&shipperId=${shipperId}`,
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
          setHistoryData(resData.data);
          return;
        default:
          setHistoryData(null);
          return;
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getHistoryData(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm xử lý bất đồng bộ gọi lên server nhiều lần để lấy dữ liệu
  const getData = useCallback(async () => {
    setIsLoading(true);
    await getDebtData();
    await getCancelOrderData();
    await getHistoryData()
    setIsLoading(false);
  }, []);

  // Theo dõi chuyển tab để lấy lại danh sách dữ liệu
  useEffect(() => {
    const getListData = navigation.addListener("focus", () => {
      getData();
    });
    return getListData;
  }, [navigation]);

  // Component header
  const Header = () => {
    return (
      <View style={styles.containerHeader}>
        {/* Toggle Menu */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons
            name="menu"
            size={30}
            color={COLORS.light}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        {/* Ngày tháng hiện tại */}
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={styles.textDate}>Công nợ & Lịch sử</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };

  // Trường hợp đang load dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header />
        <View
          style={[
            styles.footer,
            {
              backgroundColor: COLORS.light,
            },
          ]}
        >
          <View style={styles.containerCenter}>
            <ActivityIndicator size="large" color={COLORS.red_13} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Nội dung trang */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: COLORS.light,
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={40}
                color={COLORS.grey}
                style={{ textAlign: "center" }}
              />
              {/* Công nợ */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() => setIsCollapseDebt(!isCollapseDebt)}
                >
                  <Text style={styles.title}>CÔNG NỢ</Text>
                  <MaterialIcons
                    name={
                      isCollapseDebt
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.light}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapseDebt}>
                  <View style={styles.table}>
                    {/* Bảng danh sách công nợ */}
                    {debtData ? (
                      <DataTable>
                        <DataTable.Header>
                          <DataTable.Title style={{ flex: 1 }}>
                            STT
                          </DataTable.Title>
                          <DataTable.Title style={{ flex: 2 }}>
                            CỬA HÀNG
                          </DataTable.Title>
                          <DataTable.Title style={{ flex: 1 }}>
                            TRẢ QUÁN
                          </DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                          <DataTable.Cell style={{ flex: 1 }}>1</DataTable.Cell>
                          <DataTable.Cell style={{ flex: 2 }}>
                            {debtData.shopName}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 1 }}>
                            {addDotToNumber(debtData.totalPayment)}
                          </DataTable.Cell>
                        </DataTable.Row>
                      </DataTable>
                    ) : (
                      <Text style={{ textAlign: "center" }}>
                        Hiện không còn nợ
                      </Text>
                    )}
                  </View>
                </Collapsible>
              </View>
              {/* Danh sách đơn hàng bị hủy và phải hoàn trả sản phẩm */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() =>
                    setIsCollapseCancelOrder(!isCollapseCancelOrder)
                  }
                >
                  <Text style={styles.title}>DANH SÁCH HOÀN ĐƠN</Text>
                  <MaterialIcons
                    name={
                      isCollapseCancelOrder
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.light}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapseCancelOrder}>
                  <View style={styles.table}>
                    {/* Bảng danh sách hoàn đơn */}
                    {cancelOrderData ? (
                      <>
                        {cancelOrderData.map((item, index) => (
                          <View key={index}>
                            <View
                              style={styles.titleItemChild}
                              activeOpacity={0.6}
                              key={item.orderShipCode}
                            >
                              <AntDesign
                                name="plussquare"
                                size={18}
                                color={COLORS.dark}
                              />
                              <Text
                                style={{
                                  ...styles.title,
                                  color: COLORS.dark,
                                  marginLeft: 5,
                                }}
                              >
                                {item.orderShipCode}
                              </Text>
                            </View>
                            <View style={styles.table}>
                              {/* Bảng danh sách sản phẩm cần hoàn*/}
                              <DataTable>
                                <DataTable.Header>
                                  <DataTable.Title style={{ flex: 1 }}>
                                    STT
                                  </DataTable.Title>
                                  <DataTable.Title style={{ flex: 2 }}>
                                    MÃ SẢN PHẨM
                                  </DataTable.Title>
                                  <DataTable.Title style={{ flex: 1 }}>
                                    SỐ LƯỢNG
                                  </DataTable.Title>
                                </DataTable.Header>
                                {item.products.map((val, index) => (
                                  <DataTable.Row key={val.productCode}>
                                    <DataTable.Cell style={{ flex: 1 }}>
                                      {+index + 1}
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 2 }}>
                                      {val.productCode}
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1 }}>
                                      {val.productAmount}
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                ))}
                              </DataTable>
                            </View>
                          </View>
                        ))}
                      </>
                    ) : (
                      <Text style={{ textAlign: "center" }}>
                        Hiện không có đơn cần hoàn
                      </Text>
                    )}
                  </View>
                </Collapsible>
              </View>
              {/* Lịch sử giao hàng thành công trong ngày */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() => setIsCollapseHistory(!isCollapseHistory)}
                >
                  <Text style={styles.title}>LỊCH SỬ GIAO HÀNG THÀNH CÔNG</Text>
                  <MaterialIcons
                    name={
                      isCollapseHistory
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.light}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapseHistory}>
                  <View style={styles.table}>
                    {/* Bảng danh sách đơn hàng */}
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title style={{ flex: 1 }}>
                          STT
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 5 }}>
                          MÃ ĐƠN GIAO
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }}>
                          TRẢ QUÁN
                        </DataTable.Title>
                        <DataTable.Title numeric style={{ flex: 2 }}>
                          NHẬN
                        </DataTable.Title>
                      </DataTable.Header>
                      {/* gen ra danh sách đơn hàng */}
                      {historyData ? (
                        <>
                          {historyData.map((item, index) => (
                            <DataTable.Row key={index}>
                              <DataTable.Cell style={{ flex: 1 }}>
                                {+index + 1}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 5 }}>
                                {item.orderShipCode}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 2 }}>
                                {addDotToNumber(item.payment)}
                              </DataTable.Cell>
                              <DataTable.Cell numeric style={{ flex: 2 }}>
                                {addDotToNumber(item.shippingCost)}
                              </DataTable.Cell>
                            </DataTable.Row>
                          ))}
                        </>
                      ) : (
                        <Text style={{ textAlign: "center" }}>
                          Không có lịch sử nào trong ngày hôm nay
                        </Text>
                      )}
                    </DataTable>
                  </View>
                </Collapsible>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red_13,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconMenu: {
    padding: 10,
  },
  textDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.light,
  },
  footer: {
    justifyContent: "space-between",
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 15,
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  borderBottom: {
    borderBottomColor: COLORS.grey_3,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  circleIcon: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.green_5,
  },
  buttonSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: COLORS.green_5,
    borderRadius: 15,
    marginTop: 10,
  },
  detailOrder: {
    backgroundColor: COLORS.grey_3,
    marginBottom: 10,
  },
  titleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.red_13,
    paddingHorizontal: 5,
    borderBottomColor: COLORS.grey_4,
    borderBottomWidth: 1,
  },
  titleItemChild: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grey_5,
    paddingHorizontal: 5,
    borderBottomColor: COLORS.grey_4,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingLeft: 5,
    color: COLORS.light,
  },
  table: {
    padding: 5,
  },
  money: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default DebtScreen;
