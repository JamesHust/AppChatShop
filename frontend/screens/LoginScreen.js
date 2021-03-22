import React, { useState } from "react";
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

// Trang đăng nhập
const LoginScreen = ({ navigation }) => {
  //khai báo các  state
  const [apartmentCode, setApartmentCode] = useState(null);
  const [password, setPassword] = useState(null);

  //hàm xét lại giá trị cho các ô input
  const resetValueInput = () => {
    if (apartmentCode === null) {
      setApartmentCode(null);
    }
    if (password === null) {
      setPassword(null);
    }
  };
  //hàm xử lý sự kiện khi click đăng nhập
  const submitOnClick = () => {
    navigation.navigate('Home');
    // if (apartmentCode === null || password === null) {
    //   Alert.alert(
    //     "GoFAST",
    //     "Số căn hộ hoặc tên đăng nhập đang trống. VUI LÒNG NHẬP LẠI!",
    //     [
    //       {
    //         text: "OK",
    //         onPress: () => {
    //           return;
    //         },
    //       },
    //     ]
    //   );
    // } else {
    //   if (apartmentCode === "A-111" && password === "123456") {
    //     navigation.navigate('Home');
    //   } else {
    //     Alert.alert(
    //       "GoFAST",
    //       "Số căn hộ hoặc tên đăng nhập sai. VUI LÒNG NHẬP LẠI!",
    //       [
    //         {
    //           text: "OK",
    //           onPress: () => {
    //             return;
    //           },
    //         },
    //       ]
    //     );
    //     resetValueInput();
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/banner/banner-5.jpg")}
        style={styles.banner}
      />
      <Text style={styles.title}>GoFAST</Text>
      <View>
        <InputIcon
          value={apartmentCode}
          onChangeText={(value) => setApartmentCode(value)}
          nameIcon="home"
          sizeIcon={25}
          placeholder="Số căn hộ"
          secureTextEntry={false}
        />
        <InputIcon
          value={password}
          onChangeText={(value) => setPassword(value)}
          nameIcon="lock1"
          sizeIcon={25}
          placeholder="Mật khẩu"
          style={styles.bottomFix}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.forgetText}>
        <Text style={styles.textLink}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <Button
        title="Đăng nhập"
        style={styles.buttonLogin}
        onPress={submitOnClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    width: "80%",
  },
  textLink: {
    textAlign: "right",
    fontWeight: "bold",
    marginBottom: 30,
  },
});

export default LoginScreen;
