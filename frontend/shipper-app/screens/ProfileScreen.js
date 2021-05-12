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
import { MaterialCommunityIcons, FontAwesome, Ionicons, Feather } from "@expo/vector-icons";
import COLORS from "../constants/color";

const EditProfileScreen = ({ route, navigation }) => {
  // Nội dung header của bottom sheet
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

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
      <View style={{ marginTop: 0}}>
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
                  uri: "https://i.pinimg.com/564x/d9/a3/47/d9a3471dd0da18bcd855be72abaf7589.jpg",
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
              Thế Hưng
            </Text>
          </View>
        </View>
        {/* Thông tin chi tiết */}
        {/* Họ tên */}
        <View style={styles.action}>
          <FontAwesome name="user-o" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Họ tên"
            value="Thế Hưng"
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
            value="0966073028"
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
        {/* Số điện thoại khác */}
        <View style={styles.action}>
          <Feather name="phone-call" color={COLORS.grey_8} size={20} />
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            placeholder="Số điện thoại khác"
            value="0977251512"
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
            value="hungjame99@gmail.com"
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
            value="22 Ngách 20 Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội"
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
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 15
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
    position: 'absolute',
    top: 5,
    left: 5
  },
  iconMenu: {
    padding: 10,
  },
});
