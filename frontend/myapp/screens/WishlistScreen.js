import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/color";
import ListWishlist from "../components/ListWishlist";
import { FontAwesome } from "@expo/vector-icons";
import foods from "../data/foods";
import { screenWidth } from "../utils/Dimentions";

const WishListScreen = ({ navigation }) => {
  const [products, setProducts] = useState(foods);

  // Xét trường hợp cho danh sách yêu thích trống
  // useEffect(() => {
  if (!products || products.length <= 0) {
    return (
      <View style={{flex: 1}}>
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
            <Text style={styles.title}>Danh sách yêu thích</Text>
          </View>
        </View>
        {/* Danh sách sản phẩm yêu thích trống */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* Nội dung */}
          <View
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../assets/wishlist.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Danh sách yêu thích trống!</Text>
            <Text
              style={{
                fontSize: 16,
                width: screenWidth - 100,
                textAlign: "center",
              }}
            >
              Cùng goFAST trải nghiệm và thêm sản phẩm yêu thích ngay nào.
            </Text>
          </View>
        </View>
      </View>
    );
  }
  // }, [listProduct]);
  return (
    <SafeAreaView>
      {/* Header */}
      <View style={styles.header}>
        {/* Quay về trang đầu */}
        <View style={styles.flexContainer}>
          <Icon
            name="arrow-back"
            size={28}
            color={COLORS.red_13}
            onPress={() => navigation.popToTop()}
          />
          <Text style={styles.title}>Danh sách yêu thích</Text>
        </View>
        <View>
          {/* đặt nhanh */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="dollar" size={22} color={COLORS.light} />
            </View>
          </View>
        </View>
      </View>
      {/* Danh sách sản phẩm yêu thích */}
      <ListWishlist
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={products}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default WishListScreen;
