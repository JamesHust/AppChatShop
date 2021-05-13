import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../constants/color";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SupportScreen = ({navigation}) => {
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
          <Text style={styles.textDate}>Hỗ trợ</Text>
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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../assets/support.png")}
              resizeMode="center"
              style={styles.image}
            />
            <Text style={styles.textAlign}>
              Gặp sự cố khi sử dụng ứng dụng. Vui lòng gọi điện thoại đến số{" "}
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.red_13,
                  fontWeight: "bold",
                }}
              >
                0966073028
              </Text>{" "}
              để được hỗ trợ sớm nhất.
            </Text>
            <Text style={styles.textAlign}>
              Mọi ý kiến thắc mắc xin gửi về hòm thư
            </Text>
            <Text
              style={{
                ...styles.textAlign,
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: 16,
              }}
            >
              hungjame99@gmail.com
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ ...styles.buttonSubmit }}
          activeOpacity={0.8}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="phone"
              size={24}
              color={COLORS.light}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                color: COLORS.light,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Gọi tổng đài
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red_13,
  },
  buttonSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: COLORS.green_5,
    borderRadius: 15,
    marginTop: 10,
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
  textAlign: {
    textAlign: "center",
    fontSize: 15,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default SupportScreen;
