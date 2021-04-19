import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import InputIcon from "../components/InputIcon";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import * as authActions from "../redux/actions/auth";
import COLORS from "../constants/color";
import HideWithKeyboard from "react-native-hide-with-keyboard";

// Trang đăng nhập
const LoginScreen = ({ navigation }) => {
  //khai báo các  state
  const [data, setData] = useState({
    username: "",
    password: "",
    isValidUser: true,
    isValidPassword: true,
  });
  const [showPassword, setShowPassword] = useState(true); //biến hiển thị password
  const dispatch = useDispatch(); //khởi tạo dispatch

  // Hàm xet show password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  //hàm xử lý sự kiện khi click đăng nhập
  const submitOnClick = () => {
    if (!data.isValidUser || !data.isValidPassword) {
      Alert.alert("goFAST", "Vui lòng nhập đúng tài khoản của bạn.", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    } else {
      //thực hiện đăng nhập, gửi request lên server để check tài khoản
      fetch("http://192.168.1.125:3000/api/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUser: {
            username: data.username,
            password: data.password,
          },
          actor: "customer",
        }),
      })
        .then(async (response) => {
          switch (response.status) {
            // trường hợp thành công
            case 200:
              const resData = await response.json();
              dispatch(authActions.storageToken(resData.data));
              return navigation.navigate("Home");
            // trường hợp request truyền sang
            case 400:
              Alert.alert("goFAST", "Dữ liệu truyền sang đang bị trống.", [
                {
                  text: "OK",
                  style: "cancel",
                },
              ]);
              return;
            case 404:
              Alert.alert(
                "goFAST",
                "Không tồn tại tài khoản phù hợp. Vui lòng nhập lại.",
                [
                  {
                    text: "OK",
                    style: "cancel",
                  },
                ]
              );
              return;
            case 500:
              Alert.alert("goFAST", "Lỗi hệ thống.", [
                {
                  text: "OK",
                  style: "cancel",
                },
              ]);
              return;
          }
        })
        .catch((e) => {
          Alert.alert("goFAST", `Có lỗi không mong muốn: ${e}`, [
            {
              text: "OK",
              style: "cancel",
            },
          ]);
        });
    }
  };

  // Validate tên đăng nhập
  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  // Validate mật khẩu
  const handleValidPass = (val) => {
    if (val.trim().length >= 8) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setData({
        ...data,
        isValidPassword: regex.test(String(val)),
      });
    } else {
      setData({
        ...data,
        isValidPassword: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/banner/banner-5.jpg")}
          style={styles.banner}
        />
        <Text style={styles.title}>GoFAST</Text>
        <View>
          <InputIcon
            value={data.username}
            nameIcon="user"
            sizeIcon={25}
            placeholder="Tên đăng nhập"
            secureTextEntry={false}
            isValid={data.isValidUser}
            onChangeText={(value) => setData({ ...data, username: value })}
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          />
          <InputIcon
            value={data.password}
            nameIcon="lock1"
            sizeIcon={25}
            placeholder="Mật khẩu"
            style={styles.bottomFix}
            secureTextEntry={showPassword}
            nameIconRight={showPassword ? "eye-off-outline" : "eye-outline"}
            onAction={togglePassword}
            isValid={data.isValidPassword}
            onChangeText={(value) => setData({ ...data, password: value })}
            onEndEditing={(e) => handleValidPass(e.nativeEvent.text)}
          />
        </View>
        <View style={styles.forgetText}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <Text style={styles.textLink}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <Button title="Đăng nhập" onPress={submitOnClick} />
      </View>
      <HideWithKeyboard style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
        <Text style={styles.textNotice}>
          Yêu cầu: Tên đăng nhập có ít nhất 4 ký tự
        </Text>
        <Text style={styles.textNotice}>
          Mật khẩu có ít nhất 6 ký tự: có ít nhất 1 chữ hoa, thường, 1 số và 1
          ký tự đặc biệt.
        </Text>
      </HideWithKeyboard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.light,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontFamily: "open-sans-bold",
    marginBottom: 25,
  },
  banner: {
    height: 250,
    width: 300,
  },
  bottomFix: {
    marginBottom: 6,
  },
  forgetText: {
    marginTop: 5,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  textLink: {
    fontWeight: "bold",
    marginBottom: 30,
  },
  textNotice: {
    color: COLORS.grey_6,
    fontSize: 12,
    textAlign: "center",
  },
  errorMsg: {
    color: COLORS.red_14,
    fontSize: 14,
  },
});

export default LoginScreen;
