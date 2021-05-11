import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../constants/color";
import ListWishlist from "../components/ListWishlist";
import { screenWidth } from "../utils/Dimentions";
import { useDispatch, useSelector } from "react-redux";
import * as wishlistActions from "../redux/actions/wishlist";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const WishListScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const customer = useSelector((state) => state.authReducer.customer);
  const wishlist = useSelector((state) => state.wishlistReducer.wishlist);
  const dispatch = useDispatch();

  // Hàm load danh sách yêu thích
  const loadWishList = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      dispatch(wishlistActions.getWishlist(customer.customerId, token));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadWishList(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, [setIsLoading]);

  // Hàm gọi để load danh sách yêu thích
  useEffect(() => {
    loadWishList();
  }, [dispatch, setIsLoading]);

  // Component header
  const Header = () => {
    return (
      <View style={{marginBottom: 20}}>
        {/* Header */}
        <View>
          <TouchableOpacity
            onPress={() => navigation.popToTop()}
            style={styles.iconBack}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
          </TouchableOpacity>
          <View style={styles.title}>
            <Text style={styles.titleScreen}>Danh sách yêu thích</Text>
          </View>
        </View>
      </View>
    );
  };

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

  // Xét trường hợp cho danh sách yêu thích trống
  if (!wishlist || wishlist.length <= 0) {
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
            <Text style={styles.title}>Danh sách yêu thích</Text>
          </View>
        </View>
        {/* Danh sách sản phẩm yêu thích trống */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Nội dung */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Danh sách sản phẩm yêu thích */}
      <ListWishlist
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={wishlist}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
