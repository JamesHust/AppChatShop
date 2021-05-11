import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Title, Caption, Text, TouchableRipple } from "react-native-paper";
import * as authActions from "../redux/actions/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import COLORS from "../constants/color";
import myaccount from "../data/myaccount";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions, StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

import Share from "react-native-share";

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [reviews, setReviews] = useState(0);//số lượt đánh giá của khách hàng
  const [timeOfOrder, setTimeOfOrder] = useState(0);//số lượt đặt hàng thành công của khách hàng
  const dispatch = useDispatch(); //khởi tạo dispatch
  const customer = useSelector((state) => state.authReducer.customer);

  // xử lý chia sẻ profile
  const myCustomShare = async () => {
    const shareOptions = {
      message:
        "Order your next meal from FoodFinder App. I've already ordered more than 10 meals on it.",
      url: "",
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log("Error => ", error);
    }
    Alert.alert("Test share info");
  };

  // Hàm xử lý sự kiện cập nhật hồ sơ
  const redirectEditProfile = () =>
    navigation.navigate("EditProfile", { data: myaccount });

  // hàm xử lý sự kiện đăng xuất
  const logoutHandle = () => {
    try {
      dispatch(authActions.logout());
      navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      Alert.alert("goFAST", `Có lỗi không mong muốn: ${e}`, [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm lấy số lượt đánh giá và lượt đặt hàng thành công
  const loadRateAndSuccessOrders = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://192.168.1.125:3000/api/rates/customers?customerId=${customer.customerId}`, {
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
          setReviews(resData.data.review);
          setTimeOfOrder(resData.data.timesOfOrder);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          Alert.alert("goFAST", `Lỗi lấy số lượng đánh giá và đặt hàng thành công:`, [
            {
              text: "Tải lại",
              onPress: () => loadRateAndSuccessOrders(),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadProducts(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, [setIsLoading]);

  //check thay đổi khi tải trang
  useEffect(() => {
    loadRateAndSuccessOrders();
  }, [loadRateAndSuccessOrders, setIsLoading]);

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerCenter}>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Thông tin chi tiết của người dùng */}
      <View style={styles.userInfoSection}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            {/* Ảnh avatar */}
            <Image
              source={{
                uri: customer.avatar,
              }}
              style={styles.avatar}
            />
            {/* Họ tên người dùng */}
            <View style={{ marginLeft: 20 }}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}
              >
                {customer.customerName}
              </Title>
              <Caption style={styles.caption}>@admin</Caption>
            </View>
          </View>
          {/* Cập nhật thông tin */}
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={redirectEditProfile}>
              <View style={styles.iconUpdateProfile}>
                <FontAwesome5 name="user-edit" size={20} color={COLORS.light} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Thông tin chi tiết tài khoản - người dùng */}
        <View style={styles.userInfoDetail}>
          {/* Địa chỉ */}
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              color={COLORS.light}
              size={20}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: COLORS.light, marginLeft: 20, width: 250 }}
            >
              {customer.address}
            </Text>
          </View>
          {/* Số điện thoại */}
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="phone"
              color={COLORS.light}
              size={20}
            />
            <Text style={{ color: COLORS.light, marginLeft: 20 }}>
              {customer.phoneNumber}
            </Text>
          </View>
          {/* Email */}
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="email"
              color={COLORS.light}
              size={20}
            />
            <Text style={{ color: COLORS.light, marginLeft: 20 }}>
              {customer.email}
            </Text>
          </View>
        </View>
      </View>
      {/* Thông tin tổng quát lượng đặt hàng, lượt đánh giá */}
      <View style={styles.infoBoxWrapper}>
        {/* Số lượt đánh giá */}
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>{reviews}</Title>
          <Caption style={styles.captionCustom}>Lượt đánh giá</Caption>
        </View>
        {/* Số lượt đặt hàng */}
        <View style={styles.infoBox}>
          <Title>{timeOfOrder}</Title>
          <Caption style={styles.captionCustom}>Lượt đặt hàng</Caption>
        </View>
      </View>
      {/* Menu tùy chọn */}
      <ScrollView
        style={styles.menuWrapper}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách yêu thích */}
        <TouchableRipple
          onPress={() =>
            navigation.navigate("Wishlist", { idUser: myaccount.id })
          }
        >
          <View style={styles.menuItem}>
            <MaterialCommunityIcons
              name="heart-outline"
              color={COLORS.red_13}
              size={25}
            />
            <Text style={styles.menuItemText}>Danh sách yêu thích</Text>
          </View>
        </TouchableRipple>
        {/* Theo dõi đơn hàng */}
        <TouchableRipple
          onPress={() =>
            navigation.navigate("MonitorStack")
          }
        >
          <View style={styles.menuItem}>
            <MaterialIcons
              name="local-shipping"
              color={COLORS.red_13}
              size={25}
            />
            <Text style={styles.menuItemText}>Theo dõi đơn hàng</Text>
          </View>
        </TouchableRipple>
        {/* Đơn đã hoàn thành */}
        <TouchableRipple
          onPress={() =>
            navigation.navigate("CompleteOrderStack")
          }
        >
          <View style={styles.menuItem}>
            <MaterialIcons
              name="history"
              color={COLORS.red_13}
              size={25}
            />
            <Text style={styles.menuItemText}>Đơn đã hoàn thành</Text>
          </View>
        </TouchableRipple>
        {/* Thay đổi mật khẩu */}
        <TouchableRipple
          onPress={() =>
            navigation.navigate("ChangePassScreen", { idUser: myaccount.id })
          }
        >
          <View style={styles.menuItem}>
            <MaterialCommunityIcons name="account-key" size={25} color={COLORS.red_13} />
            <Text style={styles.menuItemText}>Thay đổi mật khẩu</Text>
          </View>
        </TouchableRipple>
        {/* Chia sẻ hồ sơ */}
        <TouchableRipple onPress={myCustomShare}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons
              name="share-outline"
              color={COLORS.red_13}
              size={25}
            />
            <Text style={styles.menuItemText}>Chia sẻ hồ sơ</Text>
          </View>
        </TouchableRipple>
        {/* Hỗ trợ */}
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons
              name="account-check-outline"
              color={COLORS.red_13}
              size={25}
            />
            <Text style={styles.menuItemText}>Hỗ trợ</Text>
          </View>
        </TouchableRipple>
        {/* Cài đặt */}
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="settings-outline" color={COLORS.red_13} size={25} />
            <Text style={styles.menuItemText}>Cài đặt</Text>
          </View>
        </TouchableRipple>
        {/* Đăng xuất */}
        <TouchableRipple onPress={logoutHandle}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons
              name="logout"
              size={25}
              color={COLORS.red_13}
            />
            <Text style={styles.menuItemText}>Đăng xuất</Text>
          </View>
        </TouchableRipple>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoSection: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.red_13,
    paddingBottom: 5,
  },
  userInfoDetail: {
    marginTop: 10,
    paddingRight: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: COLORS.light,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.light,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
    color: COLORS.light,
  },
  captionCustom: {
    color: COLORS.dark,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {},
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  iconUpdateProfile: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.red_14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45 / 2,
  },
});
