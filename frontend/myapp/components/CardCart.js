import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import COLORS from "../constants/color";
import { addDotToNumber } from "../utils/Common";

const CardCart = ({ item, checkedAll }) => {
  const [checked, setChecked] = React.useState(false);
  const [amount, setAmount] = useState(1);
  // Check tất cả các thẻ trong trường hợp chọn tất cả
  useEffect(() => {
    setChecked(checkedAll);
  }, [checkedAll]);

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (amount > 1) {
      setAmount((amount) => amount - 1);
    } else setAmount(1);
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    setAmount((amount) => amount + 1);
  };
  return (
    <View style={style.cardCart}>
      {/* Chọn xem có đặt mua không */}
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
        color={COLORS.red_13}
      />
      {/* Ảnh minh họa cho sản phẩm */}
      <Image source={{ uri: item.image }} style={{ height: 90, width: 90 }} />
      {/* Thông tin sản phẩm */}
      <View style={style.infoProductContainer}>
        {/* Tên sản phẩm */}
        <Text style={style.nameProduct} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        {/* Loại sản phẩm */}
        <Text style={{ fontSize: 13, color: COLORS.grey }}>{item.cate}</Text>
        {/* Giá sản phẩm */}
        <Text style={style.price}>{addDotToNumber(item.price)} ₫</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
    </View>
  );
};

const style = StyleSheet.create({
  cardCart: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 7,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
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
    width: 100,
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
});
export default CardCart;
