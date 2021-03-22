import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { windowHeight, windowWidth } from "../utils/Dimentions";

const InputIcon = (props) => {
  return (
    <View style={{...styles.inputContainer, ...props.style}}>
      <View style={styles.iconStyle}>
        <AntDesign name={props.nameIcon} size={props.sizeIcon} color="#666" />
      </View>
      <TextInput
        value={props.value}
        style={styles.input}
        numberOfLines={props.numberOfLines}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        onChangeText={props.onChangeText}
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "80%",
    height: windowHeight / 13,
    borderColor: "#ccc",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  iconStyle: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  input: {
    paddingRight: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: "open-sans",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default InputIcon;
