import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/color";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import products from "../data/products";
import selects from "../data/selects";
import ListCartProduct from "../components/ListCartProduct";
import ListButtonSelect from "../components/ListButtonSelect";
import { screenWidth } from "../utils/Dimentions";

const SearchScreen = (props) => {
  const idUser = "ID_USER"; //chỗ này cần lấy id từ server
  const [listProducts, setListProducts] = useState(products);

  //Xét trường hợp tìm kiếm không thấy
  const NotFound = () => {
    return (
      <View style={{ backgroundColor: COLORS.light, flex: 1 }}>
        {/* Nội dung */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../assets/404.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          <Text style={styles.titlePage}>Không tìm thấy kết quả!</Text>
          <Text
            style={{
              fontSize: 16,
              width: screenWidth - 100,
              textAlign: "center",
            }}
          >
            Vui lòng nhập và tìm kiếm lại.
          </Text>
        </View>
      </View>
    );
  };

  // Header của trang
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
          {/* Giỏ hàng, đặt nhanh */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="dollar" size={22} color={COLORS.light} />
            </View>
          </View>
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
            />
          </View>
          <View style={styles.sortBtn}>
            <MaterialIcons name="sort" size={23} color={COLORS.light} />
          </View>
        </View>
        {/* Gợi ý */}
        <ListButtonSelect
          data={selects}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header của trang */}
      <Header />
      {/* Danh sách sản phẩm tìm kiếm */}
      {!listProducts || listProducts.length <= 0 ? (
        <NotFound />
      ) : (
        <ListCartProduct data={products} />
      )}
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
  titlePage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 10,
    textAlign: "center",
    width: screenWidth - 60,
  },
  headerEmpty: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
});

export default SearchScreen;
