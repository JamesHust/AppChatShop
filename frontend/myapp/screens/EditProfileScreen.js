import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import ImagePicker from "react-native-image-crop-picker";
import COLORS from "../constants/color";
import { windowHeight } from "../utils/Dimentions";
import { useSelector, useDispatch } from "react-redux";

const EditProfileScreen = ({ route, navigation }) => {
  const infoUser = route.params.data; //Thông tin gửi sang
  const [avatar, setAvatar] = useState(infoUser.avatar);
  const [nameUser, setNameUser] = useState(infoUser.name);
  const [email, setEmail] = useState(infoUser.email);
  const [phone, setPhone] = useState(infoUser.phone);
  const [phoneOther, setPhoneOther] = useState(infoUser.phoneOther);
  const [address, setAddress] = useState(infoUser.address);
  const { colors } = useTheme();
  const fall = new Animated.Value(1);
  const bs = useRef(0);
  const customer = useSelector(state => state.authReducer.customer);

  LogBox.ignoreAllLogs(); //Ignore all log notifications

  // Lấy ảnh chụp từ camera
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      setAvatar(image.path);
      bs.current.snapTo(1);
    });
    Alert.alert("Test lấy ảnh");
  };

  // Lấy ảnh từ thư viện
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      setAvatar(image.path);
      bs.current.snapTo(1);
    });
  };

  // Nội dung thẻ bottom sheet
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Tải ảnh lên</Text>
        <Text style={styles.panelSubtitle}>Chọn ảnh của bạn</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}>Chụp ảnh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={styles.panelButtonTitle}>Chọn từ thư viện</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}
      >
        <Text style={styles.panelButtonTitle}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  // Nội dung header của bottom sheet
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false} //thuộc tính này cho phép onPress trong inner content
      />

      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          height: windowHeight - 65,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View>
            <TouchableOpacity onPress={() => navigation.popToTop()} style={{width: 30}}>
              <AntDesign
                name="arrowleft"
                size={24}
                color={COLORS.red_13}
              />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              {/* Ảnh avatar */}
              <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: customer.avatar,
                    }}
                    style={{ height: 100, width: 100 }}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="camera"
                        size={35}
                        color={COLORS.light}
                        style={{
                          opacity: 0.7,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: COLORS.light,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              {/* Tên tài khoản */}
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: COLORS.dark,
                }}
              >
                {customer.customerName}
              </Text>
            </View>
          </View>
          {/* Thông tin chi tiết */}
          {/* Họ tên */}
          <View style={styles.action}>
            <FontAwesome name="user-o" color={COLORS.grey_8} size={20} />
            <TextInput
              placeholder="Họ tên"
              value={nameUser}
              placeholderTextColor={COLORS.grey_8}
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          {/* Số điện thoại */}
          <View style={styles.action}>
            <Feather name="phone" color={COLORS.grey_8} size={20} />
            <TextInput
              placeholder="Số điện thoại"
              defaultValue={customer.phoneNumber}
              placeholderTextColor={COLORS.grey_8}
              keyboardType="number-pad"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          {/* Số điện thoại khác */}
          <View style={styles.action}>
            <Feather name="phone-call" color={COLORS.grey_8} size={20} />
            <TextInput
              placeholder="Số điện thoại khác"
              defaultValue={customer.otherPhoneNumber}
              placeholderTextColor={COLORS.grey_8}
              keyboardType="number-pad"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          {/* Email */}
          <View style={styles.action}>
            <FontAwesome name="envelope-o" color={COLORS.grey_8} size={20} />
            <TextInput
              placeholder="Email"
              defaultValue={customer.email}
              placeholderTextColor={COLORS.grey_8}
              keyboardType="email-address"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          {/* Địa chỉ */}
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              color={COLORS.grey_8}
              size={20}
            />
            <TextInput
              placeholder="Địa chỉ"
              defaultValue={customer.address}
              placeholderTextColor={COLORS.grey_8}
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
        </View>
        {/* Nút cập nhật thông tin */}
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Cập nhật</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 1 : -15,
    paddingLeft: 10,
    fontSize: 14
  },
});
