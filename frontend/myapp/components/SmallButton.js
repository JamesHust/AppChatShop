import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const SmallButton = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ ...styles.background, ...styles.position }}
      onPress={props.onPress}
    >
      {/* Nội dung bên trong button */}
      <Text style={{ ...props.style, ...styles.button }}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  position: {
    marginRight: 15,
  },
  background: {
    backgroundColor: "#ca4540",
    borderRadius: 20,
  },
  button: {
    paddingVertical: 10,
    textAlign: "center",
    width: 120,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default SmallButton;
