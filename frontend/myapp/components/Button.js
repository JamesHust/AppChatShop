import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../utils/Dimentions";
import COLORS from "../constants/color";

const Button = (props) => {
  const color = props.color ? props.color : COLORS.red_13;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ ...styles.button, ...props.style, backgroundColor: color}}
      onPress={props.onPress}
    >
      {/* Nội dung bên trong button */}
      <Text style={{ ...props.style, ...styles.buttonText }}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight / 13,
  },
  buttonText: {
    paddingVertical: 10,
    textAlign: "center",
    width: windowWidth * 0.8,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Button;
