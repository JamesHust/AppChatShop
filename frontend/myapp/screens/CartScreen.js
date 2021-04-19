import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import COLORS from "../constants/color";
import foods from "../data/foods";
import CardCart from "../components/CardCart";
import { Checkbox } from "react-native-paper";
import { screenWidth } from "../utils/Dimentions";

const CartScreen = () => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [listProduct, setListProduct] = useState(foods);
  // Check trong trường hợp giỏ hàng trống
  // useEffect(() => {
    if (!listProduct || listProduct.length <= 0) {
      return (
        <View style={{ backgroundColor: COLORS.light, flex: 1 }}>
          {/* Logo */}
          <View style={style.header}>
            <Image
              source={require("../assets/logo/logo3.png")}
              resizeMode="contain"
              style={{ height: 50, width: 115 }}
            />
          </View>
          {/* Nội dung */}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../assets/shopping-bag.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={style.titlePage}>Giỏ hàng trống!</Text>
            <Text
              style={{
                fontSize: 16,
                width: screenWidth - 100,
                textAlign: "center",
              }}
            >
              Còn chờ gì nữa, shopping cùng goFAST ngay nào.
            </Text>
          </View>
        </View>
      );
    }
  // }, [listProduct]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      <View style={style.header}>
        <View>
          <Image
            source={require("../assets/logo/logo3.png")}
            resizeMode="contain"
            style={{ height: 50, width: 115 }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={style.title}>Tất cả</Text>
          <View style={{ paddingTop: 15 }}>
            <Checkbox
              status={checkedAll ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedAll(!checkedAll);
              }}
              color={COLORS.red_13}
            />
          </View>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={listProduct}
        renderItem={({ item }) => (
          <CardCart item={item} checkedAll={checkedAll} />
        )}
        ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
        ListFooterComponent={() => (
          <View>
            {/* Tiền ship */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>Phí vận chuyển</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.red_14,
                }}
              >
                15,000
              </Text>
            </View>
            {/* Tổng tiền thanh toán */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Tổng tiền
              </Text>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "bold",
                  color: COLORS.red_14,
                }}
              >
                415,000
              </Text>
            </View>
            {/* Nút đặt mua */}
            <TouchableOpacity
              style={{ ...style.commandButton, backgroundColor: COLORS.grey_6 }}
              onPress={() => {}}
            >
              <Text style={style.panelButtonTitle}>Xóa khỏi giỏ hàng</Text>
            </TouchableOpacity>
            {/* Nút đặt mua */}
            <TouchableOpacity style={style.commandButton} onPress={() => {}}>
              <Text style={style.panelButtonTitle}>Đặt mua</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  title: {
    color: COLORS.grey_7,
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 15,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  titlePage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 10,
    textAlign: "center",
    width: screenWidth - 60,
  },
});

export default CartScreen;
