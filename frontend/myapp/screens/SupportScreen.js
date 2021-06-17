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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const SupportScreen = ({ navigation }) => {
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
            <Text style={styles.titleScreen}>Hỗ trợ khách hàng</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <Header />
        {/* Danh sách đơn hàng theo dõi trống*/}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Nội dung */}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: COLORS.green_5,
    borderRadius: 15,
    marginBottom: 15,
    width: '95%'
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
