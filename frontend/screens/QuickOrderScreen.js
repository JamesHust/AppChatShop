import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import COLORS from "../constants/color";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import TabCategories from "../components/TabCategories";
import products from "../data/products";
import ListCartProduct from "../components/ListCartProduct";

const QuickOrderScreen = (props) => {
  const categories = ["HOT", "Khuyến mãi", "Gần tôi", "Yêu thích"];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxHeader}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: COLORS.dark }}
            >
              Đặt Hàng Ngay
            </Text>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: COLORS.orange_14,
              }}
            >
              goFAST
            </Text>
          </View>
          {/* Giỏ hàng */}
          <Ionicons name="cart" size={30} color={COLORS.dark} />
        </View>
        {/* search-bar */}
        <View style={{ marginTop: 20, flexDirection: "row" }}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={21} color={COLORS.dark} />
            <TextInput
              placeholder="Tìm kiếm mã hoặc tên sản phẩm"
              style={{ marginLeft: 7 }}
            />
          </View>
          <View style={styles.sortBtn}>
            <MaterialIcons name="sort" size={23} color={COLORS.light} />
          </View>
        </View>
        {/* Danh muc sản phẩm */}
        <TabCategories listCategory={categories} />
      </View>
      <ListCartProduct data={products} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey_4,
  },
  boxHeader: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.light,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 6.27,
    elevation: 5,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.grey_3,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sortBtn: {
    marginLeft: 10,
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.orange_14,
    borderRadius: 10,
  },
});

export default QuickOrderScreen;
