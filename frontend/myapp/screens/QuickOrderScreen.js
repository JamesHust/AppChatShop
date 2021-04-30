import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import COLORS from "../constants/color";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import TabCategories from "../components/TabCategories";
import ListCardProduct from "../components/ListCardProduct";

const QuickOrderScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [products, setProducts] = useState(null); //danh sách sản phẩm
  const categories = useMemo(() => [
    "HOT",
    "Khuyến mãi",
    "Gần tôi",
    "Yêu thích",
  ]);
  // component header
  const Header = () => {
    return (
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
    );
  };

  // Hàm load dữ liệu
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const response = await fetch("http://192.168.0.4:3000/api/products", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setProducts(resData.data);
          return;
        default:
          Alert.alert("goFAST", `Lỗi tải dữ liệu:`, [
            {
              text: "Tải lại",
              onPress: () => loadProducts(),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadProducts(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, [setIsLoading]);

  //check thay đổi khi tải trang
  useEffect(() => {
    loadProducts();
  }, [loadProducts, setIsLoading]);

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.containerCenter}>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ListCardProduct data={products} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey_4,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
