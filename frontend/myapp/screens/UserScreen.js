import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
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

import Share from "react-native-share";

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const dispatch = useDispatch(); //khởi tạo dispatch

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
      navigation.navigate("LoginScreen");
    } catch (err) {
      Alert.alert("goFAST", `Có lỗi không mong muốn: ${e}`, [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };
  
  const customer = useSelector(state => state.authReducer.customer);

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
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
          <Title>1000</Title>
          <Caption style={styles.captionCustom}>Lượt đánh giá</Caption>
        </View>
        {/* Số lượt đặt hàng */}
        <View style={styles.infoBox}>
          <Title>24</Title>
          <Caption style={styles.captionCustom}>Lượt đặt hàng</Caption>
        </View>
      </View>
      {/* Menu tùy chọn */}
      <ScrollView
        style={styles.menuWrapper}
        showsVerticalScrollIndicator={false}
      >
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
        <TouchableRipple
          onPress={() =>
            navigation.navigate("MonitorOrder", { idUser: myaccount.id })
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
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="settings-outline" color={COLORS.red_13} size={25} />
            <Text style={styles.menuItemText}>Cài đặt</Text>
          </View>
        </TouchableRipple>
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
