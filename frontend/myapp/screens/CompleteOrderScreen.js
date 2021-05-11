import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
// import orders from "../data/orders";
import { showToast, screenWidth } from "../utils/Common";
import ListMonitorOrder from "../components/ListMonitorOrder";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const CompleteOrderScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [orders, setOrders] = useState([]); //biến chứa danh sách gì từ dân nữa
  const customer = useSelector((state) => state.authReducer.customer);
  // Component header
  const Header = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* Header */}
        <View>
          <TouchableOpacity
            onPress={() => navigation.popToTop()}
            style={styles.iconBack}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
          </TouchableOpacity>
          <View style={styles.title}>
            <Text style={styles.titleScreen}>Danh sách đơn hàng</Text>
          </View>
        </View>
      </View>
    );
  };

  // Hàm load danh sách đơn hàng
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://192.168.1.125:3000/api/process/orders?customerId=${customer.customerId}&status=complete`,
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
          setOrders(resData.data);
          setIsLoading(false);
          return;
        case 404:
          setIsLoading(false);
          setOrders([]);
          return;
        default:
          setIsLoading(false);
          showToast("Lấy danh sách đơn hàng thất bại");
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadOrders(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, []);

  // Hàm gọi để load danh sách đơn hàng đang trong tiến trình
  useEffect(() => {
    const load = navigation.addListener("focus", () => {
      loadOrders();
    });
    return load;
  }, [setIsLoading, navigation]);

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Thanh tìm kiếm đơn hàng */}
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={18} color={COLORS.dark} />
          <TextInput
            placeholder="Tìm kiếm theo mã đơn hàng"
            style={{ marginLeft: 5 }}
          />
        </View>
        {/* Nội dung của trang */}
        <View style={styles.content}>
          <View style={styles.containerCenter}>
            <ActivityIndicator size="large" color={COLORS.red_13} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Xét trường hợp không có đơn hàng nào đang thực hiện
  if (!orders || orders.length <= 0) {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <Header />
        {/* Danh sách sản phẩm yêu thích trống */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Nội dung */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../assets/box-empty.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Hiện không có đơn hàng nào!</Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                width: 350,
              }}
            >
              Cùng goFAST trải nghiệm và tiến hành đặt hàng ngay.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Thanh tìm kiếm đơn hàng */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={18} color={COLORS.dark} />
        <TextInput
          placeholder="Tìm kiếm theo mã đơn hàng"
          style={{ marginLeft: 5 }}
        />
      </View>
      {/* Nội dung của trang */}
      <View style={styles.content}>
        <ListMonitorOrder data={orders} showsVerticalScrollIndicator={true} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    position: "relative",
  },
  iconBack: {
    position: "absolute",
    zIndex: 1,
    top: 15,
    left: 15,
  },
  title: {
    marginTop: 12,
  },
  titleScreen: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.grey_3,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    height: 42,
    alignItems: "center",
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    marginTop: 10,
    paddingTop: 10,
    backgroundColor: COLORS.grey_3,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBack: {
    position: "absolute",
    zIndex: 1,
    top: 15,
    left: 15,
  },
  title: {
    marginTop: 12,
  },
  titleScreen: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titlePage: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 10,
    textAlign: "center",
  },
});

export default CompleteOrderScreen;
