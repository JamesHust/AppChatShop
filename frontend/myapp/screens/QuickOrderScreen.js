import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity
} from "react-native";
import COLORS from "../constants/color";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import TabCategories from "../components/TabCategories";
import products from "../data/products";
import ListCartProduct from "../components/ListCartProduct";

const QuickOrderScreen = (props) => {
  const categories = ["HOT", "Khuyến mãi", "Gần tôi", "Yêu thích"];
  const idUser = "ID_USER" //chỗ này cần lấy id từ server
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxHeader}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Image
              source={require("../assets/logo/logo3.png")}
              resizeMode="contain"
              style={{ width: 120, height: 50 }}
            />
          </View>
          {/* đặt nhanh */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="dollar" size={22} color={COLORS.light} />
            </View>
          </View>
        </View>
        {/* search-bar */}
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={21} color={COLORS.dark} />
            <TextInput
              placeholder="Tìm kiếm mã hoặc tên sản phẩm"
              style={{ marginLeft: 5 }}
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
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.grey_3,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  sortBtn: {
    marginLeft: 5,
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.red_13,
    borderRadius: 15,
  },
  iconWrapper: {
    height: 38,
    width: 38,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    borderRadius: 20,
  },
});

export default QuickOrderScreen;
