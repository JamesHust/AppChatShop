import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import COLORS from "../constants/color";
import * as authActions from "../redux/actions/auth";
import { StackActions } from "@react-navigation/native";

const DrawerContent = (props) => {
  const [activeOn, setActiveOn] = useState(false);
  const paperTheme = useTheme();
  const dispatch = useDispatch(); //khởi tạo dispatch
  const shipper = useSelector((state) => state.authReducer.shipper);

  // hàm xử lý sự kiện đăng xuất
  const logoutHandler = () => {
    try {
      dispatch(authActions.logout());
      props.navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      Alert.alert("goFAST", `Có lỗi không mong muốn: ${err}`, [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Phần nội dung drawer */}
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          {/* Phần thông tin vắn tài khoản */}
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15, alignItems: 'center' }}>
              <Avatar.Image
                source={{
                  uri: shipper.avatar
                    ? shipper.avatar
                    : "https://lh4.googleusercontent.com/w6GWZF8osSNKfUK0KSOrIGX_c_E_xJB8cj5ZmJkYnWmqWaeEk1HncCOaUnGAAXXaCPT_YWIyZLRwaURYxS1Vj2AS3BBUe5ohizQHiNbk6wCTq0sYFb8Zj0bEl-H3X04fLKolp--B",
                }}
                size={75}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>{shipper.shipperName}</Title>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Caption style={styles.caption}>@shipper</Caption>
                  {/* Đánh giá */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                    <AntDesign name="star" size={15} color={COLORS.amber} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: COLORS.dark,
                        marginLeft: 5,
                        fontSize: 13,
                      }}
                    >
                      {shipper.rating}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5
                  }}
                >
                  <Octicons
                    name="primitive-dot"
                    size={15}
                    color={COLORS.green_13}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{...styles.caption, fontSize: 14}}>Đang hoạt động</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Các tab */}
          <Drawer.Section style={styles.drawerSection}>
            {/* Trang chủ */}
            <DrawerItem
              icon={({ color }) => (
                <AntDesign name="home" color={color} size={22} />
              )}
              label="Trang chủ"
              onPress={() => {
                props.navigation.navigate("Mission");
              }}
            />
            {/* Nhận nhiệm vụ */}
            <DrawerItem
              icon={({ color }) => (
                <MaterialCommunityIcons
                  name="email-receive-outline"
                  size={22}
                  color={color}
                />
              )}
              label="Nhận nhiệm vụ"
              onPress={() => {
                props.navigation.navigate("TakingMission");
              }}
            />
            {/* Công nợ */}
            <DrawerItem
              icon={({ color }) => (
                <MaterialIcons name="payment" size={22} color={color} />
              )}
              label="Công nợ"
              onPress={() => {
                props.navigation.navigate("Debt");
              }}
            />
            {/* Hồ sơ */}
            <DrawerItem
              icon={({ color }) => (
                <AntDesign name="user" color={color} size={22} />
              )}
              label="Hồ sơ"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
            {/* Cài đặt */}
            <DrawerItem
              icon={({ color }) => (
                <AntDesign name="setting" size={22} color={color} />
              )}
              label="Cài đặt"
              onPress={() => {
                props.navigation.navigate("Setting");
              }}
            />
            {/* Hỗ trợ từ tổng đài */}
            <DrawerItem
              icon={({ color }) => (
                <MaterialIcons name="support-agent" size={22} color={color} />
              )}
              label="Support"
              onPress={() => {
                props.navigation.navigate("Support");
              }}
            />
          </Drawer.Section>
          {/* Phần switch trạng thái hoạt động */}
          {/* <Drawer.Section title="Hoạt động">
            <TouchableRipple
              onPress={() => {
                setActiveOn(!activeOn);
              }}
            >
              <View style={styles.preference}>
                <Text>Trạng thái</Text>
                <View pointerEvents="none">
                  <Switch value={activeOn} color={COLORS.red_13} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      {/* Phần footer của drawer - Đăng xuất */}
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={color}
              size={size}
            />
          )}
          label="Đăng xuất"
          onPress={logoutHandler}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 18,
    borderBottomColor: COLORS.grey_3,
    paddingBottom: 20,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 15,
    color: COLORS.grey_7,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: COLORS.grey_3,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 15,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  bottomDrawerSection: {
    borderTopColor: COLORS.grey_4,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
