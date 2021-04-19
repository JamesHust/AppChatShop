import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/Dimentions";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addDotToNumber } from "../utils/Common";

const CartProduct = (props) => {
  const [product, setProduct] = useState(props.data.item);
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation(); //Cho phép truy cập navigation

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
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={() => navigation.navigate("DetailProduct", { data: product })}
    >
      <View>
        {/* Ảnh minh họa sản phẩm */}
        <View>
          <Image
            source={{ uri: product.img }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        {/* Thông tin cơ bản sản phẩm */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={styles.containerInfoProduct}>
            {/* Tên sản phẩm */}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.nameProduct}
            >
              {product.name}
            </Text>
            {/* Giá bán sản phẩm */}
            <Text style={styles.textPrice}>
              {addDotToNumber(product.price)} ₫
            </Text>
            {/* Đánh giá, số lượng đã bán */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <AntDesign name="star" size={13} color={COLORS.amber} />
              {/* Đánh giá */}
              <Text
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 2,
                  color: COLORS.dark,
                }}
              >
                {product.rating}
              </Text>
              {/* Số lượng đã bán */}
              <Text style={{ fontWeight: "bold", color: COLORS.grey_6 }}>
                ({product.sold})
              </Text>
            </View>
          </View>
          {/* Thêm số lượng sản phẩm > 0 vào giỏ hàng*/}
          <View style={styles.containerSetAmount}>
            <View style={styles.buttonSetAmount}>
              <Text style={styles.iconSetAmount} onPress={increasingAmount}>
                +
              </Text>
            </View>
            <View
              style={{
                ...styles.buttonSetAmount,
                backgroundColor: COLORS.red_13,
              }}
            >
              <Text style={styles.iconSetAmount}>{amount}</Text>
            </View>
            <View style={styles.buttonSetAmount}>
              <Text style={styles.iconSetAmount} onPress={reduceAmount}>
                -
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    width: screenWidth / 2,
    backgroundColor: COLORS.light,
    borderRadius: 15,
    borderColor: COLORS.grey_4,
    borderWidth: 1,
    overflow: "hidden",
    padding: 10,
  },
  image: {
    width: screenWidth / 2 - 30,
    height: 175,
  },
  containerInfoProduct: {
    width: "75%",
  },
  nameProduct: {
    fontSize: 15,
    color: COLORS.dark,
    width: "95%",
  },
  textPrice: {
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 5,
    color: COLORS.red_14,
  },
  containerSetAmount: {
    width: "22%",
    height: 90,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonSetAmount: {
    height: 30,
    backgroundColor: COLORS.red_14,
    justifyContent: "center",
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
});

export default CartProduct;
