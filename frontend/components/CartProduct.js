import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { screenWidth } from "../utils/Dimentions";
import COLORS from "../constants/color";
import { AntDesign } from '@expo/vector-icons';

const CartProduct = (props) => {
  const [amount, setAmount] = useState(0);

  //Hàm thêm '.' vào số
  const addDotToNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
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
    <View style={styles.container}>
      <View>
        <Image
          source={{ uri: props.data.item.img }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <View style={{ padding: 10, width: "82%" }}>
          <Text style={{ fontSize: 15 }}>{props.data.item.name}</Text>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 5 }}>
            {addDotToNumber(props.data.item.price)} ₫
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <AntDesign name="star" size={13} color={COLORS.amber} />
            <Text style={{ fontWeight: "bold", marginHorizontal: 2 }}>
              {props.data.item.rating}
            </Text>
            <Text style={{ fontWeight: "bold", color: COLORS.grey_6 }}>
              ({props.data.item.sold})
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "18%",
            height: 90,
            borderTopLeftRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 30,
              backgroundColor: COLORS.orange_14,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: COLORS.light,
                textAlign: "center",
              }}
              onPress={increasingAmount}
            >
              +
            </Text>
          </View>
          <View
            style={{
              height: 30,
              backgroundColor: COLORS.orange_2,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontWeight: "bold",
                color: COLORS.light,
              }}
            >
              {amount}
            </Text>
          </View>
          <View
            style={{
              height: 30,
              backgroundColor: COLORS.orange_14,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: COLORS.light,
                textAlign: "center",
              }}
              onPress={reduceAmount}
            >
              -
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    width: screenWidth / 2 - 25,
    backgroundColor: COLORS.light,
    marginHorizontal: 4,
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
  },
  image: {
    width: 190,
    height: 190,
  },
});

export default CartProduct;
