import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import COLORS from "../constants/color";
import * as Animatable from "react-native-animatable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import QueueOrder from "../components/QueueOrder";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { showToast } from "../utils/Common";
import { useSelector, useDispatch } from "react-redux";
import configData from "../config/config.json";

const TakingMissionScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState();
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [mission, setMission] = useState(null); //danh sách nhiệm vụ
  const dispatch = useDispatch();
  const shipper = useSelector((state) => state.authReducer.shipper);

  // Reset lại toàn bộ dữ liệu khi chuyển sang tab khác
  useEffect(() => {
    const resetData = navigation.addListener('focus', async () => {
      setSearchText(null);
      setMission(null);
    });
    return resetData;
  }, [navigation]);

  // Hàm lấy order theo code
  const getOrderByCode = async (orderCode) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}receiver/orders?orderCode=${orderCode}&shopId=${shipper.shopId}`,
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
          setMission(resData.data);
          setIsLoading(false);
          return;
        default:
          setMission(null);
          showToast(`Không tìm được đơn hàng có mã ${orderCode}.`);
          setIsLoading(false);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getOrderByCode(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm xử lý khi nhận đơn giao hàng
  const handlerReceiveOrder = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}shippers/receive`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            shipperId: shipper.shipperId,
            orderId: mission.orderId,
            orderCode: mission.orderCode,
            shopCode: mission.shopCode,
          }),
        }
      );
      setMission(null);
      switch (response.status) {
        case 200:
          setSearchText(null);
          setIsLoading(false);
          showToast(`Nhận đơn hàng thành công.`);
          return;
        default:
          setIsLoading(false);
          showToast(`Không thể nhận đơn hàng này.`);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => handlerReceiveOrder(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm xử lý khi chọn search
  const handlerSearch = async () => {
    const orderCode = searchText;
    if (orderCode) {
      await getOrderByCode(orderCode);
    } else {
      showToast("Vui lòng nhập mã đơn hàng cần nhận!");
    }
  };

  // Bỏ qua hóa đơn
  const ignoreOrder = () => {
    setIsLoading(true);
    setMission(null);
    setSearchText("");
    setIsLoading(false);
  };

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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textDate}>12 Tháng 5</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Nội dung form đăng nhập */}
        <Animatable.View
          animation="fadeInUpBig"
          style={[
            styles.footer,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </Animatable.View>
      </SafeAreaView>
    );
  }

  // Xét trường hợp không có nhiệm vụ nào
  if (!mission) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Nội dung form đăng nhập */}
        <View
          style={[
            styles.footer,
            {
              justifyContent: "flex-start",
              alignItems: "center",
            },
          ]}
        >
          {/* search-bar */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Tìm kiếm theo mã đơn giao hàng..."
                onChangeText={(text) => setSearchText(text)}
                onSubmitEditing={handlerSearch}
                defaultValue={searchText}
              />
            </View>
            <TouchableOpacity
              style={styles.sortBtn}
              activeOpacity={0.8}
              onPress={handlerSearch}
            >
              <Ionicons name="search" size={21} color={COLORS.light} />
            </TouchableOpacity>
          </View>
          {/* Nội dung */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <Image
              source={require("../assets/tracking.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Tìm kiếm ngay</Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                width: 280,
              }}
            >
              Vui lòng nhập mã đơn giao để nhận đơn hàng
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.red_13} />
      {/* Header */}
      <Header />
      {/* Nội dung form đăng nhập */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: COLORS.light,
          },
        ]}
      >
        {/* search-bar */}
        <View style={{ flexDirection: "row" }}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Tìm kiếm theo mã đơn giao hàng..."
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={handlerSearch}
              defaultValue={searchText}
            />
          </View>
          <TouchableOpacity
            style={styles.sortBtn}
            activeOpacity={0.8}
            onPress={handlerSearch}
          >
            <Ionicons name="search" size={21} color={COLORS.light} />
          </TouchableOpacity>
        </View>
        {/* Phần hiển thị đơn hàng tìm kiếm theo mã giao hàng */}
        <View>
          <QueueOrder
            data={mission}
            ignoreOrder={ignoreOrder}
            handlerReceiveOrder={handlerReceiveOrder}
          />
        </View>
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
    marginTop: 15,
  },
  iconMenu: {
    padding: 10,
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    paddingVertical: 30,
  },
  textDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.light,
  },
  titlePage: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.grey_3,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  sortBtn: {
    marginLeft: 5,
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.red_13,
    borderRadius: 15,
  },
});

export default TakingMissionScreen;
