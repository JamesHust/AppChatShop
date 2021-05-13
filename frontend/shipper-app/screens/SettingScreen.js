import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";

const SettingScreen = ({ navigation }) => {
  const [theme, setTheme] = useState(false);
  const [receiveNotification, setReceiveNotification] = useState(true);
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
          <Text style={styles.textDate}>Cài đặt</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.flexBox}>
            <Text style={styles.title}>Chủ đề</Text>
            <Switch value={theme} color={COLORS.red_13} />
          </View>
          <View style={styles.flexBox}>
            <Text style={styles.title}>Nhận thông báo</Text>
            <Switch value={receiveNotification} color={COLORS.red_13} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: COLORS.grey_3,
    borderBottomWidth: 1
  },
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
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 15,
  },
  textDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.light,
  },
  title:{
    fontSize: 16
  }
});

export default SettingScreen;
