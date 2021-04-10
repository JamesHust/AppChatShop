import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
  return (
    <SafeAreaView style={styles.container}>
      {/* header, thanh tìm kiếm */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: COLORS.light,
              }}
            >
              goFAST
            </Text>
          </View>
          <View style={{ width: screenWidth / 2 }}>
            <Text style={{ textAlign: "right", color: COLORS.light }}>
              Giao hàng đến:
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={20}
                color={COLORS.light}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: COLORS.light,
                  width: screenWidth / 2 - 20,
                  fontWeight: "bold",
                }}
              >
                Căn B-108, Tòa nhà C2, Ngoại Giao Đoàn, Cầu Giấy, Hà Nội
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
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>Danh mục</Text>
            <Text
              style={{ color: COLORS.orange_14, fontSize: 14 }}
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
            height={180}
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
    backgroundColor: COLORS.orange_7,
    padding: 10,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  headerTitle: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  menuContainer: {
    padding: 10,
    height: 176,
    marginTop: 10,
    marginHorizontal: 10,
  },
  caroselContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    width: screenWidth,
    height: 180,
  },
  collectionContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
