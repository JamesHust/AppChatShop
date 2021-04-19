import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import { addDotToNumber } from "../utils/Common";
import { AntDesign } from "@expo/vector-icons";
import RatingStar from "../components/RatingStar";
import ReadMore from "react-native-read-more-text";
import { TouchableOpacity } from "react-native-gesture-handler";

const DetailProductScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState(0);
  // Thông tin sản phẩm
  const product = route.params.data;
  console.log(product);
  const [favourite, setFavourite] = useState(product.favourite);

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (amount > 0) {
      setAmount((amount) => amount - 1);
    } else setAmount(0);
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    setAmount((amount) => amount + 1);
  };

  // Hiển thị khi co đoạn text
  const renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{ color: COLORS.red_13, marginTop: 5 }}
        onPress={handlePress}
      >
        Chi tiết
      </Text>
    );
  };

  // Hiển thị khi đang hiện thị toàn bộ đoạn text
  const renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{ color: COLORS.red_13, marginTop: 5 }}
        onPress={handlePress}
      >
        Thu gọn
      </Text>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          {/* Quay về trang đầu */}
          <Icon
            name="arrow-back"
            size={28}
            color={COLORS.red_13}
            onPress={() => navigation.popToTop()}
          />
        </View>
        {/* Thêm hoặc xóa khỏi danh sách yêu thích */}
        <View style={styles.iconAddFavourite}>
          <AntDesign
            name={favourite ? "hearto" : "heart"}
            size={27}
            color={favourite ? COLORS.grey_6 : COLORS.red_14}
            style={{ paddingTop: 3 }}
            onPress={() => setFavourite(!favourite)}
          />
        </View>
        {/* Ảnh minh họa */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.img ? product.img : product.image }}
            resizeMode="contain"
            style={styles.imageProduct}
          />
        </View>
        {/* Thông tin chi tiết sản phẩm */}
        <View style={styles.detailsContainer}>
          {/* Đánh giá sản phẩm */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đánh giá</Text>
            </View>
            {/* Số sao đánh giá */}
            <View>
              <RatingStar rated={product.rated} />
            </View>
          </View>
          {/* Tên và giá sản phẩm */}
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                color: COLORS.dark,
                width: "75%",
              }}
            >
              {product.name}
            </Text>
            {/* Giá tiền sản phẩm */}
            <View style={styles.priceTag}>
              <Text
                style={{
                  marginLeft: 15,
                  color: COLORS.light,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {addDotToNumber(product.price)} ₫
              </Text>
            </View>
          </View>
          {/* Mô tả, thông tin chung sản phẩm */}
          <View style={{ marginTop: 5 }}>
            {/* Tên loại sản phẩm */}
            <Text style={{ fontSize: 16 }}>{product.cate}</Text>
            {/* Rating của sản phẩm */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <AntDesign name="star" size={20} color={COLORS.amber} />
              {/* Đánh giá */}
              <Text
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 2,
                  color: COLORS.dark,
                  fontSize: 18,
                }}
              >
                {product.rating}
              </Text>
              {/* Số lượng đã bán */}
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.grey_6,
                  fontSize: 18,
                }}
              >
                ({product.sold})
              </Text>
            </View>
            {/* Mô tả */}
            <Text
              style={{
                color: COLORS.grey_7,
                fontWeight: "bold",
                marginTop: 15,
                fontSize: 18,
              }}
            >
              Đơn vị : {product.unit}
            </Text>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={renderTruncatedFooter}
              renderRevealedFooter={renderRevealedFooter}
            >
              <Text
                style={{
                  color: "grey",
                  fontSize: 16,
                  lineHeight: 22,
                  marginTop: 5,
                }}
              >
                {product.description}
              </Text>
            </ReadMore>
          </View>
        </View>
      </ScrollView>
      {/* Tiến hành đặt mua */}
      <View style={styles.stickyContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.containerSetAmount}>
              <TouchableOpacity onPress={reduceAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...styles.buttonSetAmount,
                    backgroundColor: COLORS.grey_5,
                  }}
                >
                  <Text style={styles.iconSetAmount}>-</Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...styles.buttonSetAmount,
                }}
              >
                <Text style={{ ...styles.iconSetAmount, color: COLORS.dark }}>
                  {amount}
                </Text>
              </View>
              <TouchableOpacity onPress={increasingAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...styles.buttonSetAmount,
                    backgroundColor: COLORS.red_13,
                  }}
                >
                  <Text style={styles.iconSetAmount}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Đặt mua */}
          <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.buyBtn}>
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Đặt mua
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageProduct: {
    width: 300,
    height: 300,
  },
  detailsContainer: {
    marginTop: 5,
    backgroundColor: COLORS.light,
    marginHorizontal: 20,
    marginBottom: 7,
    borderRadius: 20,
    paddingTop: 15,
  },
  borderBtn: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
  },
  borderBtnText: { fontWeight: "bold", fontSize: 28 },
  buyBtn: {
    width: 130,
    height: 45,
    backgroundColor: COLORS.red_13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  priceTag: {
    backgroundColor: COLORS.red_13,
    width: 100,
    height: 40,
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    position: "absolute",
    right: -20,
  },
  stickyContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.grey_4,
  },
  containerSetAmount: {
    flexDirection: "row",
    overflow: "hidden",
  },
  buttonSetAmount: {
    width: 35,
    height: 35,
    justifyContent: "center",
    borderRadius: 15,
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
  iconAddFavourite: {

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 3,
  },
});

export default DetailProductScreen;
