import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";

//Từng thành phần trong menu
const ItemMenu = (props) => {
  return (
    <View>
      <View style={styles.boxImg}>
        <Image source={props.data.img} style={styles.icon} />
      </View>
      <Text style={styles.titleMenu}>{props.data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxImg: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    backgroundColor: COLORS.red_2,
    padding: 22,
    borderRadius: 15,
  },
  icon: {
    width: 50,
    height: 50,
  },
  titleMenu: {
    textAlign: "center",
    marginRight: 15,
    fontSize: 14,
    marginTop: 5,
    color: COLORS.dark
  },
});

export default ItemMenu;
