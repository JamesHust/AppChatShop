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

const SuccessDelive = ({ navigation }) => {
  // Component header
  const Header = () => {
    return (
      <View style={styles.containerHeader}>
        {/* Quay về màn hình chính */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.popToTop()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={COLORS.light}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        {/* Ngày tháng hiện tại */}
        <View style={{ flex: 5, alignItems: "center" }}>
          <Text style={styles.textDate}>Giao hàng thành công</Text>
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
              source={require("../assets/thank-you.png")}
              resizeMode="center"
              style={styles.image}
            />
            <Text style={{...styles.textAlign, fontSize: 20, fontWeight: 'bold'}}>
              Cảm ơn bạn đã giao hàng thành công cho khách hàng!
            </Text>
            <Text style={styles.textAlign}>
              Tiếp tục cố gắng nha 😉
            </Text>
          </View>
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
    fontSize: 18,
    width: 350,
    
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default SuccessDelive;
