import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";
import { screenWidth } from "../utils/Dimentions";
import { FontAwesome } from "@expo/vector-icons";

//Thẻ chat
const CartChat = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: props.avatar }}
        resizeMode="cover"
        style={styles.avatar}
      />
      <View style={{ marginLeft: 15 }}>
        <View style={styles.titleCart}>
          <Text style={styles.nameReceiver}>{props.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: COLORS.grey_9, fontSize: 14, marginRight: 5 }}>
              {props.activeStatus}
            </Text>
            <FontAwesome
              name="circle"
              size={12}
              color={COLORS.light_green_14}
              style={{paddingTop: 2}}
            />
          </View>
        </View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageText}>
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
    marginVertical: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
  },
  titleCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    color: COLORS.grey_9,
    width: screenWidth - 105,
    fontSize: 14,
  },
  nameReceiver: {
    fontSize: 18,
    color: COLORS.grey_9,
    paddingBottom: 5,
  },
});

export default CartChat;
