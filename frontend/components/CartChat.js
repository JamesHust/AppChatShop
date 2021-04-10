import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";
import { screenWidth } from "../utils/Dimentions";

//Thẻ chat
const CartChat = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={props.avatar}
        resizeMode="cover"
        style={styles.avatar}
      />
      <View style={{ marginLeft: 15 }}>
        <View style={styles.titleCart}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>{props.name}</Text>
          <Text style={{ color: COLORS.grey_5 }}>{props.time}</Text>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: COLORS.grey_9,
            width: screenWidth - 105,
          }}
        >
          {props.messageText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  titleCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CartChat;
