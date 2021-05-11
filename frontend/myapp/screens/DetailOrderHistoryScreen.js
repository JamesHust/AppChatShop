import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/color";
import StepIndicator from "react-native-step-indicator";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import foods from "../data/foods";
import { addDotToNumber } from "../utils/Common";
import { screenWidth } from "../utils/Dimentions";

const OrderHistoryScreen = ({ navigation }) => {
  const [listProduct, setListProduct] = useState(foods);

  // Xét trường hợp không có đơn hàng nào đang thực hiện
  if (!listProduct || listProduct.length <= 0) {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          {/* Quay về trang đầu */}
          <View style={styles.flexContainer}>
            <Icon
              name="arrow-back"
              size={28}
              color={COLORS.red_13}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Theo dõi đơn hàng</Text>
          </View>
        </View>
        {/* Danh sách sản phẩm yêu thích trống */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Nội dung */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../assets/box-empty.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Hiện không có đơn hàng nào!</Text>
            <Text
              style={{
                fontSize: 16,
                width: screenWidth - 100,
                textAlign: "center",
              }}
            >
              Cùng goFAST trải nghiệm và tiến hành đặt hàng ngay.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      {/* Header */}
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
            <Text style={styles.titleScreen}>Chi tiết đơn hàng</Text>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titleChild}>Chi tiết hóa đơn</Text>
        {/* Hóa đơn */}
        <View style={styles.billContainer}>
          {/* header title */}
          <View style={styles.flexContainer}>
            <Text style={{ ...styles.tableTitle, width: "8%" }}>STT</Text>
            <Text style={{ ...styles.tableTitle, width: "20%" }}>Mã SP</Text>
            <Text style={{ ...styles.tableTitle, width: "38%" }}>
              Tên sản phẩm
            </Text>
            <Text style={{ ...styles.tableTitle, width: "15%" }}>SL</Text>
            <Text style={{ ...styles.tableTitle, width: "20%" }}>Giá tiền</Text>
          </View>
          {/* Nội dung hóa đơn */}
          <ScrollView style={{ height: 180 }}>
            {listProduct.map((item, index) => (
              <View style={styles.flexContainer}>
                <Text
                  style={{
                    width: "8%",
                    ...styles.propChild,
                  }}
                >
                  {index + 1}
                </Text>
                <Text style={{ width: "20%", ...styles.propChild }}>
                  {item.code}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ width: "35%", ...styles.propChild }}
                >
                  {item.name}
                </Text>
                <Text style={{ width: "10%", ...styles.propChild }}>
                  {item.buy}
                </Text>
                <Text
                  style={{
                    width: "20%",
                    ...styles.propChild,
                    textAlign: "right",
                    paddingRight: 10,
                  }}
                >
                  {addDotToNumber(parseInt(item.price) * item.buy)}
                </Text>
              </View>
            ))}
          </ScrollView>
          {/* Tổng tiền */}
          <View
            style={{
              ...styles.flexContainer,
              justifyContent: "space-between",
              ...styles.borderTop,
              paddingTop: 5,
            }}
          >
            <Text
              style={{ ...styles.tableTitle, paddingLeft: 10, fontSize: 16 }}
            >
              Tổng tiền
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: COLORS.red_14,
                fontWeight: "bold",
                paddingHorizontal: 10,
              }}
            >
              {addDotToNumber(totalBill(listProduct))}
            </Text>
          </View>
        </View>

        <View
          style={{
            ...styles.billContainer,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri:
                "https://i.pinimg.com/564x/fa/80/72/fa807217c90135f24be924972c465666.jpg",
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, color: COLORS.dark }}
            >
              BKShop
            </Text>
            <Text>Ngày tạo đơn: 15/12/2020</Text>
            <Text>Cập nhật lúc: 15/12/2020</Text>
          </View>
        </View>
        {/* Nút đặt mua */}
        <TouchableOpacity
          style={styles.commandButton}
          onPress={handleCancelOrder}
        >
          <Text style={styles.panelButtonTitle}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  stepIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  titleChild: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.red_14,
  },
  billContainer: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
  },
  tableTitle: {
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.dark,
    fontSize: 14,
    paddingVertical: 5,
  },
  borderTop: {
    borderTopWidth: 2,
    borderTopColor: COLORS.grey_4,
  },
  propChild: {
    color: COLORS.grey_6,
    textAlign: "center",
    paddingVertical: 5,
  },
  titlePage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 10,
    textAlign: "center",
    width: screenWidth - 60,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginTop: 10,
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

export default OrderHistoryScreen;
