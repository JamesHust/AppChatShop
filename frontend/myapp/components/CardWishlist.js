import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";
import { addDotToNumber } from "../utils/Common";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CartWishList = (props) => {
  const [amount, setAmount] = useState(0);
  const [product, setProduct] = useState(props.data);
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
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("DetailProduct", { data: product })}>
      <View style={style.cardWishlist}>
        <View style={style.flexContainer}>
          {/* Ảnh minh họa cho sản phẩm */}
          <Image
            source={{ uri: product.image }}
            style={{ height: 100, width: 100 }}
          />
          {/* Thông tin sản phẩm */}
          <View style={style.infoProductContainer}>
            {/* Tên sản phẩm */}
            <Text
              style={style.nameProduct}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {product.name}
            </Text>
            {/* Loại sản phẩm */}
            <Text style={{ fontSize: 13, color: COLORS.grey }}>
              {product.cate}
            </Text>
            {/* Giá sản phẩm */}
            <Text style={style.price}>{addDotToNumber(product.price)} ₫</Text>
          </View>
        </View>
        <View
          style={{
            ...style.flexContainer,
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <View style={style.actionContainer}>
            <View style={style.containerSetAmount}>
              <TouchableOpacity onPress={reduceAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...style.buttonSetAmount,
                    backgroundColor: COLORS.grey_5,
                  }}
                >
                  <Text style={style.iconSetAmount}>-</Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...style.buttonSetAmount,
                }}
              >
                <Text style={{ ...style.iconSetAmount, color: COLORS.dark }}>
                  {amount}
                </Text>
              </View>
              <TouchableOpacity onPress={increasingAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...style.buttonSetAmount,
                    backgroundColor: COLORS.red_13,
                  }}
                >
                  <Text style={style.iconSetAmount}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <View style={style.flexContainer}>
              <MaterialIcons name="delete" size={24} color={COLORS.grey_6} />
              <Text style={{ fontSize: 16, color: COLORS.grey_6 }}>Xóa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  cardWishlist: {
    height: 140,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 5,
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  nameProduct: {
    fontWeight: "bold",
    fontSize: 16,
    width: 225,
    color: COLORS.dark,
  },
  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.red_13,
  },
  infoProductContainer: {
    height: 100,
    marginLeft: 10,
    paddingVertical: 18,
    flex: 1,
    justifyContent: "space-between",
  },
  containerSetAmount: {
    flexDirection: "row",
    overflow: "hidden",
  },
  buttonSetAmount: {
    width: 30,
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default CartWishList;
