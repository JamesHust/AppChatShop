import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../redux/actions/auth";
import * as cartActions from "../redux/actions/cart";
import COLORS from "../constants/color";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import configData from "../config/config.json";

// Trang đăng nhập
const LoginScreen = ({ navigation }) => {
  // Khai báo các ref
  const inputPass = useRef(null);

  //khai báo các  state
  const [data, setData] = useState({
    username: "",
    password: "",
    isValidUser: true,
    isValidPassword: true,
  });
  const [showPassword, setShowPassword] = useState(true); //biến hiển thị password
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [notificationModalVisible, setNotificationModalVisible] = useState(
    false
  ); //Modal báo tài khoản hoặc mật khẩu sai hoặc hết phiên
  const [notificationText, setNotificationText] = useState(null); //text thông báo trên modal
  const dispatch = useDispatch(); //khởi tạo dispatch

  // Hàm load dữ liệu
  const checkSignedIn = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${configData.SERVER_URL}check/token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": userToken,
        },
      });
      switch (res.status) {
        case 200:
          const resData = await res.json();
          dispatch(authActions.storageToken(resData.data));
          dispatch(
            cartActions.getOldCart(resData.data.user.CustomerId, userToken)
          );
          return navigation.navigate("Home");
        default:
          setNotificationText(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"
          );
          setNotificationModalVisible(true);
          return;
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  // Hàm kiểm tra đã login chưa
  useEffect(() => {
    checkSignedIn();
  }, [dispatch]);

  // Hàm xet show password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý khi nhập xong tên đăng nhập sẽ tự động focus input pass
  const onFocusInputPass = () => {
    inputPass.current.focus();
  };

  //hàm xử lý sự kiện khi click đăng nhập
  const submitOnClick = () => {
    if (!data.isValidUser || !data.isValidPassword) {
      setNotificationText(
        "Tài khoản nhập đang bị sai. Vui lòng nhập đúng tài khoản và mật khẩu của bạn."
      );
      setNotificationModalVisible(true);
    } else {
      //thực hiện đăng nhập, gửi request lên server để check tài khoản
      fetch(`${configData.SERVER_URL}login`, {
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
              dispatch(
                cartActions.getOldCart(
                  resData.data.customer.customerId,
                  resData.data.accessToken
                )
              );
              return navigation.navigate("Home");
            // trường hợp request truyền sang
            case 400:
              setNotificationText(
                "Dữ liệu truyền sang đang bị trống. Vui lòng nhập tài khoản của bạn."
              );
              setNotificationModalVisible(true);
              return;
            case 404:
              setNotificationText(
                "Không tồn tại tài khoản phù hợp. Vui lòng nhập lại tài khoản của bạn."
              );
              setNotificationModalVisible(true);
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

  // Modal thông báo tài khoản, mật khẩu nhập đang sai, hoặc hết phiên
  const NotificationModal = () => {
    return (
      <View style={{ ...styles.content, height: 195 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setNotificationModalVisible(false)}
        />
        <Text style={styles.contentTitle}>Thông báo 😵</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
            height: 140
          }}
        >
          <Text>{notificationText}</Text>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => setNotificationModalVisible(false)}
            >
              <Text style={{ color: COLORS.light }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modal cảnh báo xóa giỏ hàng khi trong giỏ có sản phẩm của cửa hàng khác */}
      <Modal isVisible={notificationModalVisible} backdropColor={COLORS.grey_9}>
        <NotificationModal />
      </Modal>
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
            onSubmitEditing={onFocusInputPass}
            blurOnSubmit={false}
          />
          <InputIcon
            ref={inputPass}
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
            onSubmitEditing={submitOnClick}
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
          Mật khẩu có ít nhất 8 ký tự: có ít nhất 1 chữ hoa, thường, 1 số và 1
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
  content: {
    backgroundColor: COLORS.red_13,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 15,
    borderColor: COLORS.red_13,
    height: 290,
    position: "relative",
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginLeft: 5,
    color: COLORS.light,
    fontWeight: "bold",
  },
  iconClose: {
    zIndex: 1,
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 99,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: COLORS.red_13,
    fontSize: 15,
    marginLeft: 10,
    borderRadius: 15,
  },
});

export default LoginScreen;
