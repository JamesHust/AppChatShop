import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import InputIcon from "../components/InputIcon";
import { windowWidth } from "../utils/Dimentions";
import { useSelector } from "react-redux";
import { showToast } from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import Modal from "react-native-modal";

const ChangePassScreen = ({ navigation }) => {
  // Khai báo các ref
  const inputOldPass = useRef(null);
  const inputReOldPass = useRef(null);
  const inputNewPass = useRef(null);
  //khai báo các  state
  const [data, setData] = useState({
    oldPass: "",
    reOldPass: "",
    newPass: "",
  });
  const [showPassword, setShowPassword] = useState({
    oldPass: true,
    reOldPass: true,
    newPass: true,
  });
  const [isValidPassword, setIsValidPassword] = useState({
    oldPass: true,
    reOldPass: true,
    newPass: true,
  });
  const [notificationModalVisible, setNotificationModalVisible] = useState(
    false
  ); //Modal báo tài khoản hoặc mật khẩu sai hoặc hết phiên
  const [notificationText, setNotificationText] = useState(null); //text thông báo trên modal
  const customer = useSelector((state) => state.authReducer.customer);

  // Validate mật khẩu
  const handleValidPass = (val, typePass) => {
    if (val.trim().length >= 8) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(String(val))) {
        if (typePass === "reOldPass") {
          if (val != data.oldPass) {
            showToast("Mật khẩu nhập lại không khớp. Vui lòng nhập lại.");
            return setIsValidPassword({
              ...isValidPassword,
              [typePass]: false,
            });
          }
        }
        if (typePass === "newPass") {
          if (val == data.oldPass) {
            showToast(
              "Mật khẩu mới giống với mật khẩu hiện tại. Vui lòng nhập lại."
            );
            return setIsValidPassword({
              ...isValidPassword,
              [typePass]: false,
            });
          }
        }
        return setIsValidPassword({
          ...isValidPassword,
          [typePass]: true,
        });
      } else {
        showToast(
          "Mật khẩu phải có ít nhất 1 chữ hoa, thường, 1 số và 1 ký tự đặc biệt"
        );
        return setIsValidPassword({
          ...isValidPassword,
          [typePass]: false,
        });
      }
    } else {
      showToast("Mật khẩu có ít nhất 8 ký tự");
      return setIsValidPassword({
        ...isValidPassword,
        [typePass]: false,
      });
    }
  };

  // Hàm xử lý gọi lên server và thực hiện thay đổi mật khẩu tài khoản khách hàng
  const handlerChangePass = async () => {
    if (data.oldPass && data.reOldPass && data.newPass) {
      if (data.oldPass && data.reOldPass && data.newPass) {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const response = await fetch(
            `http://192.168.1.125:3000/api/customers/${customer.customerId}`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-access-token": token,
              },
              body: JSON.stringify({
                password: data.newPass,
                oldPass: data.oldPass,
              }),
            }
          );
          switch (response.status) {
            case 200:
              navigation.popToTop();
              showToast("Cập nhật thành công");
              return;
            case 400:
              const resData = await response.json();
              if (resData.isSuccess) {
                setNotificationText("Mật khẩu cũ nhập sai. Vui lòng nhập lại!");
                setNotificationModalVisible(true);
              } else {
                Alert.alert("goFAST", `Lỗi yêu cầu cập nhật:`, [
                  {
                    text: "Thực hiện lại",
                    onPress: () => handlerChangePass(),
                  },
                  {
                    text: "OK",
                    style: "cancel",
                  },
                ]);
              }
              return;
            default:
              Alert.alert("goFAST", `Lỗi yêu cầu cập nhật:`, [
                {
                  text: "Thực hiện lại",
                  onPress: () => handlerChangePass(),
                },
                {
                  text: "OK",
                  style: "cancel",
                },
              ]);
              return;
          }
        } catch (err) {
          Alert.alert("goFAST", `Có lỗi không mong muốn: ${err}`, [
            {
              text: "OK",
              style: "cancel",
            },
          ]);
        }
      } else {
        setNotificationText(
          "Vui lòng nhập đúng mật khẩu để thực hiện thay đổi!"
        );
        setNotificationModalVisible(true);
      }
    } else {
      setNotificationText("Vui lòng nhập mật khẩu để thay đổi!");
      setNotificationModalVisible(true);
    }
  };

  // Modal thông báo mật khẩu sai hoặc chưa đúng yêu cầu
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
    <View style={styles.container}>
      {/* Modal cảnh báo xóa giỏ hàng khi trong giỏ có sản phẩm của cửa hàng khác */}
      <Modal isVisible={notificationModalVisible} backdropColor={COLORS.grey_9}>
        <NotificationModal />
      </Modal>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.iconBack}
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text style={styles.titleScreen}>Đổi mật khẩu</Text>
        </View>
      </View>
      {/* Nội dung trang */}
      <View style={styles.inputContainer}>
        <InputIcon
          ref={inputOldPass}
          style={styles.input}
          nameIcon="lock1"
          sizeIcon={25}
          placeholder="Mật khẩu cũ"
          value={data.oldPass}
          secureTextEntry={showPassword.oldPass}
          nameIconRight={
            showPassword.oldPass ? "eye-off-outline" : "eye-outline"
          }
          onAction={() =>
            setShowPassword({ ...showPassword, oldPass: !showPassword.oldPass })
          }
          isValid={isValidPassword.oldPass}
          onChangeText={(value) => setData({ ...data, oldPass: value })}
          onSubmitEditing={() => inputReOldPass.current.focus()}
          onEndEditing={(e) => handleValidPass(e.nativeEvent.text, "oldPass")}
        />
        <InputIcon
          ref={inputReOldPass}
          style={styles.input}
          nameIcon="lock1"
          sizeIcon={25}
          placeholder="Nhập lại mật khẩu cũ"
          value={data.reOldPass}
          secureTextEntry={showPassword.reOldPass}
          nameIconRight={
            showPassword.reOldPass ? "eye-off-outline" : "eye-outline"
          }
          onAction={() =>
            setShowPassword({
              ...showPassword,
              reOldPass: !showPassword.reOldPass,
            })
          }
          isValid={isValidPassword.reOldPass}
          onChangeText={(value) => setData({ ...data, reOldPass: value })}
          onSubmitEditing={() => inputNewPass.current.focus()}
          onEndEditing={(e) => handleValidPass(e.nativeEvent.text, "reOldPass")}
        />
        <InputIcon
          ref={inputNewPass}
          style={styles.input}
          nameIcon="lock1"
          sizeIcon={25}
          placeholder="Mật khẩu mới"
          value={data.newPass}
          secureTextEntry={showPassword.newPass}
          nameIconRight={
            showPassword.newPass ? "eye-off-outline" : "eye-outline"
          }
          onAction={() =>
            setShowPassword({ ...showPassword, newPass: !showPassword.newPass })
          }
          isValid={isValidPassword.newPass}
          onChangeText={(value) => setData({ ...data, newPass: value })}
          // onSubmitEditing={handlerChangePass}
          onEndEditing={(e) => handleValidPass(e.nativeEvent.text, "newPass")}
        />
      </View>
      {/* Nút cập nhật thông tin */}
      <TouchableOpacity
        style={styles.commandButton}
        onPress={handlerChangePass}
      >
        <Text style={styles.panelButtonTitle}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    position: "relative",
    justifyContent: "space-between",
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
  inputContainer: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    width: windowWidth - 30,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 15,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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

export default ChangePassScreen;
