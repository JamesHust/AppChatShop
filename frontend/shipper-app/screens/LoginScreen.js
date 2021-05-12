import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";

const SignInScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: "45%" }}>
          <Text style={styles.text_header}>Chào mừng</Text>
          <Text style={{ color: COLORS.light }}>
            Những đối tác thân thiện của goFAST
          </Text>
        </View>
        <Image
          source={require("../assets/shipper.png")}
          resizeMode="center"
          style={styles.image}
        />
      </View>
      {/* Nội dung form đăng nhập */}
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: COLORS.light,
          },
        ]}
      >
        {/* Tiêu đề */}
        <Text style={styles.textTitle}>Đăng nhập</Text>
        {/* Ô nhập số điện thoại, tài khoản */}
        <View style={styles.action}>
          <AntDesign name="user" size={24} color={COLORS.dark} />
          <TextInput
            placeholder="Nhập số điện thoại..."
            placeholderTextColor={COLORS.grey_7}
            style={[
              styles.textInput,
              {
                color: COLORS.dark,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => setData({ ...data, username: val })}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Username must be 4 characters long.
            </Text>
          </Animatable.View>
        )}
        {/* Ô nhập mật khẩu */}
        <View style={styles.action}>
          <AntDesign name="lock1" size={24} color={COLORS.dark} />
          <TextInput
            placeholder="Mật khẩu..."
            placeholderTextColor={COLORS.grey_7}
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: COLORS.dark,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => setData({...data, password: val})}
          />
          <TouchableOpacity onPress={() => setData({...data, secureTextEntry: !data.secureTextEntry})}>
            {data.secureTextEntry ? (
              <Ionicons name="eye-off-outline" size={24} color={COLORS.grey_7} />
            ) : (
              <Ionicons name="eye-outline" size={24} color={COLORS.grey_7} />
            )}
          </TouchableOpacity>
        </View>
        {/* Cảnh báo mật khẩuchưa đúng định dạng */}
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 8 characters long.
            </Text>
          </Animatable.View>
        )}
        {/* Xử lý quên mật khẩu */}
        <TouchableOpacity>
          <Text style={{ color: COLORS.grey_8, marginTop: 15 }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
        {/* Nút đăng nhập */}
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => navigation.navigate("MainDrawer")}
            style={[
              styles.signIn,
              {
                backgroundColor: COLORS.red_13,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: COLORS.light,
                },
              ]}
            >
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red_12,
  },
  textTitle: {
    color: COLORS.dark,
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 50,
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 27,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_5,
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 15,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.light,
  },
  image: {
    width: 200,
    height: 180,
  },
});
