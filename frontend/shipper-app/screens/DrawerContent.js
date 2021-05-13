import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import COLORS from "../constants/color";

const DrawerContent = (props) => {
  const [activeOn, setActiveOn] = useState(false);
  const paperTheme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      {/* Phần nội dung drawer */}
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          {/* Phần thông tin vắn tài khoản */}
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: "https://i.pinimg.com/564x/d9/a3/47/d9a3471dd0da18bcd855be72abaf7589.jpg",
                }}
                size={55}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>Thế Hưng</Title>
                <Caption style={styles.caption}>@shipper</Caption>
              </View>
            </View>
          </View>
          {/* Đánh giá , đơn hoàn thành trong ngày */}
          <Drawer.Section>
            <View style={styles.row}>
              {/* Đánh giá */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.dark,
                    marginRight: 5,
                    fontSize: 15,
                  }}
                >
                  4.8
                </Text>
                <AntDesign name="star" size={16} color={COLORS.amber} />
              </View>
              {/* Số đơn hoàn thành trong ngày */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.dark,
                    marginRight: 5,
                    fontSize: 15,
                  }}
                >
                  16
                </Text>
                <Text style={styles.caption}>Đơn hàng hoàn thành</Text>
              </View>
            </View>
          </Drawer.Section>
          {/* Các tab */}
          <Drawer.Section style={styles.drawerSection}>
            {/* Trang chủ */}
            <DrawerItem
              icon={({ color}) => (
                <AntDesign name="home" color={color} size={22} />
              )}
              label="Trang chủ"
              onPress={() => {
                props.navigation.navigate("Mission");
              }}
            />
            {/* Nhận nhiệm vụ */}
            <DrawerItem
              icon={({ color}) => (
                <MaterialCommunityIcons name="email-receive-outline" size={22} color={color} />
              )}
              label="Nhận nhiệm vụ"
              onPress={() => {
                props.navigation.navigate("TakingMission");
              }}
            />
            {/* Công nợ */}
            <DrawerItem
              icon={({ color}) => (
                <MaterialIcons name="payment" size={22} color={color} />
              )}
              label="Công nợ"
              onPress={() => {
                props.navigation.navigate("Debt");
              }}
            />
            {/* Hồ sơ */}
            <DrawerItem
              icon={({ color}) => (
                <AntDesign name="user" color={color} size={22} />
              )}
              label="Hồ sơ"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
            {/* Cài đặt */}
            <DrawerItem
              icon={({ color}) => (
                <AntDesign name="setting" size={22} color={color} />
              )}
              label="Cài đặt"
              onPress={() => {
                props.navigation.navigate("Setting");
              }}
            />
            {/* Hỗ trợ từ tổng đài */}
            <DrawerItem
              icon={({ color}) => (
                <MaterialIcons name="support-agent" size={22} color={color} />
              )}
              label="Support"
              onPress={() => {
                props.navigation.navigate("Support");
              }}
            />
          </Drawer.Section>
          {/* Phần switch trạng thái hoạt động */}
          <Drawer.Section title="Hoạt động">
            <TouchableRipple
              onPress={() => {
                setActiveOn(!activeOn);
              }}
            >
              <View style={styles.preference}>
                <Text>Trạng thái</Text>
                <View pointerEvents="none">
                  <Switch value={activeOn} color={COLORS.red_13}/>
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
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
    paddingLeft: 20,
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
    borderTopColor: "#f4f4f4",
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
