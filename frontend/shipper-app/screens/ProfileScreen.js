import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  LogBox,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  Feather,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import COLORS from "../constants/color";
import { useSelector, useDispatch } from "react-redux";
import { formatShowDate, addDotToNumber, showToast } from "../utils/Common";

const EditProfileScreen = ({ route, navigation }) => {
  const shipper = useSelector((state) => state.authReducer.shipper);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.buttonMenu}
        activeOpacity={0.8}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons
          name="menu"
          size={30}
          color={COLORS.red_13}
          style={styles.iconMenu}
        />
      </TouchableOpacity>
      <View style={{ marginTop: 0 }}>
        <View>
          <View style={{ alignItems: "center" }}>
            {/* Ảnh avatar */}
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
                  uri: shipper.avatar
                    ? shipper.avatar
                    : "https://lh4.googleusercontent.com/w6GWZF8osSNKfUK0KSOrIGX_c_E_xJB8cj5ZmJkYnWmqWaeEk1HncCOaUnGAAXXaCPT_YWIyZLRwaURYxS1Vj2AS3BBUe5ohizQHiNbk6wCTq0sYFb8Zj0bEl-H3X04fLKolp--B",
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}
              />
            </View>
            {/* Tên tài khoản */}
            <Text
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: "bold",
                color: COLORS.dark,
              }}
            >
              {shipper.shipperName}
            </Text>
          </View>
        </View>
        {/* Thông tin chi tiết */}
        {/* Mã shipper */}
        <View style={{...styles.action, marginTop: 30}}>
          <Entypo name="code" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Mã shipper"
            value={shipper.shipperCode}
            placeholderTextColor={COLORS.grey_8}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: COLORS.grey_6,
              },
            ]}
          />
        </View>
        {/* Số điện thoại */}
        <View style={styles.action}>
          <Feather name="phone" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Số điện thoại"
            value={shipper.phoneNumber}
            placeholderTextColor={COLORS.grey_8}
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: COLORS.grey_6,
              },
            ]}
          />
        </View>
        {/* Email */}
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Email"
            value={shipper.email}
            placeholderTextColor={COLORS.grey_8}
            keyboardType="email-address"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: COLORS.grey_6,
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
            editable={false}
            selectTextOnFocus={false}
            placeholder="Địa chỉ"
            value={shipper.address}
            placeholderTextColor={COLORS.grey_8}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: COLORS.grey_6,
              },
            ]}
          />
        </View>
        {/* Lương cứng */}
        <View style={styles.action}>
          <MaterialIcons name="attach-money" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Lương cứng"
            value={addDotToNumber(shipper.basicSalary)}
            placeholderTextColor={COLORS.grey_8}
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: COLORS.grey_6,
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 15,
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
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_4,
    paddingBottom: 8,
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 15,
  },
  buttonMenu: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  iconMenu: {
    padding: 10,
  },
});
