import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";

const ItemMenu = (props) => {
  return (
    <View>
      <View style={styles.boxImg}>
        <Image source={props.data.img} style={styles.icon} />
      </View>
      <Text style={{textAlign: 'center', marginRight: 15, fontSize: 13, marginTop: 5}}>{props.data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxImg: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    backgroundColor: COLORS.orange_1,
    padding: 22,
    borderRadius: 15,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default ItemMenu;
