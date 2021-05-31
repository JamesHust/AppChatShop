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
import { useSelector } from "react-redux";
import ListCardProduct from "../components/ListCardProduct";

const QuickOrderScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [products, setProducts] = useState(null); //danh sách sản phẩm
  const customer = useSelector((state) => state.authReducer.customer);

  // Hàm load dữ liệu
  const loadProducts = async (textSearch) => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      let api = `http://192.168.1.125:3000/api/area/products?areaId=${customer.areaId}`;
      if (textSearch) {
        api += `&productName=${textSearch}`;
      }
      const response = await fetch(api, {
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
          Alert.alert("goFAST", `Lỗi lấy danh sách sản phẩm:`, [
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
  };

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
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconWrapper}>
              <Fontisto name="shopping-bag-1" size={22} color={COLORS.light} />
            </View>
          </View> */}
        </View>
        {/* search-bar */}
        <View
          style={{ marginTop: 10, flexDirection: "row", paddingBottom: 10 }}
        >
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={21} color={COLORS.dark} />
            <TextInput
              placeholder="Tìm kiếm mã hoặc tên sản phẩm"
              style={{ marginLeft: 5 }}
              onEndEditing={(e) => loadProducts(e.nativeEvent.text)}
              onSubmitEditing={(e) => loadProducts(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.sortBtn}>
            <MaterialIcons name="sort" size={23} color={COLORS.light} />
          </View>
        </View>
      </View>
    );
  };

  //check mỗi khi người dùng chọn tab khi tải trang
  useEffect(() => {
    const callFunction = navigation.addListener("focus", async () => {
      await loadProducts();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return callFunction;
  }, [navigation]);

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
