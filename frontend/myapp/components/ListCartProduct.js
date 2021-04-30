import React from "react";
import { View, StyleSheet, Text } from "react-native";
import CardCart from "./CardCart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/color";

const ListCartProduct = (props) => {
  return (
    <View style={styles.listProduct}>
      <View style={styles.nameStore}>
        <View style={styles.dash} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="storefront"
            size={24}
            color={COLORS.red_13}
          />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>
            {props.shopName}
          </Text>
        </View>
        <View style={styles.dash} />
      </View>
      {props.data.map((item, index) => (
        <CardCart key={index} data={item} checkedAll={props.checkedAll} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listProduct: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  nameStore: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  dash: {
    height: 1,
    width: 100,
    backgroundColor: COLORS.grey_5,
  },
});

export default ListCartProduct;
