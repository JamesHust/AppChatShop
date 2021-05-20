import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../redux/actions/auth";
import Modal from "react-native-modal";
import COLORS from "../constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const SignInScreen = ({ navigation }) => {
  // Khai báo các ref
  const inputPass = useRef(null);
  const [data, setData] = useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false); //Modal báo tài khoản hoặc mật khẩu sai hoặc hết phiên
  const [notificationText, setNotificationText] = useState(null); //text thông báo trên modal
  const dispatch = useDispatch(); //khởi tạo dispatch
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu

  // Hàm check validate cho username
  const handlerValidateUser = (val) => {
    if (val.trim().length >= 6) {
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

  // Hàm check validate cho password
  const handlerValidatePass = (val) => {
    if (val.trim().length > 6) {
      const regex = /^(?=.*\d)(?=.*[a-z])[a-z0-9]{7,}$/;
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

  // Hàm load dữ liệu
  const checkSignedIn = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const res = await fetch("http://192.168.1.125:3000/api/check/token", {
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
          return navigation.navigate("MainDrawer");
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

  // Hàm xử lý khi click sumit
  const handlerOnSubmitLogin = async () => {
    if (data.username && data.password) {
      if (data.isValidPassword && data.isValidUser) {
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
            actor: "shipper",
          }),
        })
          .then(async (response) => {
            switch (response.status) {
              // trường hợp thành công
              case 200:
                const resData = await response.json();
                dispatch(authActions.storageToken(resData.data));
                return navigation.navigate("MainDrawer");
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
      } else {
        setNotificationText(
          "Tài khoản, mật khẩu bạn vừa nhập chưa đúng định dạng. Vui lòng nhập lại!"
        );
        setNotificationModalVisible(true);
      }
    } else {
      setNotificationText("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      setNotificationModalVisible(true);
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
            width: 343,
            height: 140,
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
    <SafeAreaView style={styles.container}>
      <Modal isVisible={notificationModalVisible} backdropColor={COLORS.grey_9}>
        <NotificationModal />
      </Modal>
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
            onEndEditing={(e) => handlerValidateUser(e.nativeEvent.text)}
            onSubmitEditing={() => inputPass.current.focus()}
            blurOnSubmit={false}
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
              Tên đăng nhập phải nhiều hơn hoặc bằng 6 ký tự.
            </Text>
          </Animatable.View>
        )}
        {/* Ô nhập mật khẩu */}
        <View style={styles.action}>
          <AntDesign name="lock1" size={24} color={COLORS.dark} />
          <TextInput
            ref={inputPass}
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
            onChangeText={(val) => setData({ ...data, password: val })}
            onEndEditing={(e) => handlerValidatePass(e.nativeEvent.text)}
            onSubmitEditing={handlerOnSubmitLogin}
          />
          <TouchableOpacity
            onPress={() =>
              setData({ ...data, secureTextEntry: !data.secureTextEntry })
            }
          >
            {data.secureTextEntry ? (
              <Ionicons
                name="eye-off-outline"
                size={24}
                color={COLORS.grey_7}
              />
            ) : (
              <Ionicons name="eye-outline" size={24} color={COLORS.grey_7} />
            )}
          </TouchableOpacity>
        </View>
        {/* Cảnh báo mật khẩuchưa đúng định dạng */}
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Mật khẩu có ít nhất 1 số, 1 chữ thường, hơn 6 ký tự.
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
        <View style={styles.buttonSubmit}>
          <TouchableOpacity
            onPress={handlerOnSubmitLogin}
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
    marginTop: 18,
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
  buttonSubmit: {
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
