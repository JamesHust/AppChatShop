import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../utils/Dimentions";

const Button = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ ...styles.button, ...props.style}}
      onPress={props.onPress}
    >
      {/* Nội dung bên trong button */}
      <Text style={{ ...props.style, ...styles.buttonText }}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ca4540",
    borderRadius: 10,
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
