import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { screenWidth } from "../utils/Dimentions";
import { AntDesign } from "@expo/vector-icons";
import Menu from "../components/Menu";
import categories from "../data/categories";
import { cart } from "../constants/style";
import COLORS from "../constants/color";
import Carosel from "../components/Carosel";
import banners from "../data/banners";
import ListSuggest from "../components/ListSuggest";
import suggests from "../data/suggests";

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [error, setError] = useState(null); //biến lưu lỗi
  const dispatch = useDispatch(); //khởi tạo dispatch
  const customer = useSelector(state => state.authReducer.customer);

  // Hàm load dữ liệu
  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    //fetching data ở đây
    try {
    } catch {}
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  //check thay đổi khi tải trang
  useEffect(() => {
    load().then().catch();
  }, [dispatch, load]);

  // Header của trang
  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View>
            <Image
              source={require("../assets/logo/logo3.png")}
              resizeMode="contain"
              style={{ height: 50, width: 115 }}
            />
          </View>
          {/* Địa chỉ khách hàng */}
          <View style={{ width: screenWidth / 2, paddingTop: 5 }}>
            <Text style={{ textAlign: "right", color: COLORS.dark }}>
              Giao hàng đến:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="google-maps"
                size={20}
                color={COLORS.red}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: COLORS.dark,
                  width: screenWidth / 2 - 20,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {customer.address}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={18} color={COLORS.dark} />
          <TextInput
            placeholder="Tìm món ăn, địa chỉ..."
            style={{ marginLeft: 5 }}
          />
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.containerCenter}>
          <Text>Có lỗi xảy ra</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={load}>
            <View style={{ ...styles.buttonCustom, marginTop: 5 }}>
              <Text style={styles.textButton}>Thử lại</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
      {/* header, thanh tìm kiếm */}
      <Header />
      {/* body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Danh mục sản phẩm */}
        <View style={{ ...styles.menuContainer, ...cart }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 10,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 17, color: COLORS.dark }}
            >
              Danh mục
            </Text>
            <Text
              style={{ color: COLORS.red_14, fontSize: 15 }}
              onPress={() => {}}
            >
              Xem thêm
            </Text>
          </View>
          <Menu
            data={categories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Carosel */}
        <View style={styles.caroselContainer}>
          <Carosel
            listImg={banners}
            autoplay={true}
            height={150}
            horizontal={false}
          />
        </View>
        {/* Gợi ý */}
        <View style={{ ...styles.collectionContainer, ...cart }}>
          <ListSuggest
            data={suggests}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey_4,
  },
  header: {
    backgroundColor: COLORS.light,
    padding: 10,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.grey_4,
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    alignItems: "center",
    backgroundColor: COLORS.grey_3,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  menuContainer: {
    height: 180,
    marginTop: 10,
    marginHorizontal: 10,
  },
  caroselContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    width: screenWidth,
    height: 150,
  },
  collectionContainer: {
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCustom: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.red_13,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: COLORS.light,
    fontSize: 14,
  },
});

export default HomeScreen;
