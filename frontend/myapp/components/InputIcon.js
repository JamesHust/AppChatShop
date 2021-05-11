import React, { useState, useEffect, useRef, forwardRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { windowHeight, windowWidth } from "../utils/Dimentions";
import COLORS from "../constants/color";

const InputIcon = forwardRef((props, ref) => {
  return (
    <View style={{ ...styles.inputContainer, ...props.style }}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={styles.iconStyle}>
          <AntDesign
            name={props.nameIcon}
            size={props.sizeIcon}
            color={COLORS.grey_7}
          />
        </View>
        <TextInput
          ref={ref}
          value={props.value}
          style={styles.input}
          numberOfLines={props.numberOfLines}
          placeholder={props.placeholder}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          placeholderTextColor={COLORS.grey_7}
          onEndEditing={props.onEndEditing}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
        />
      </View>

      <View>
        {!props.isValid ? (
          <AntDesign
            name="exclamationcircle"
            size={24}
            color={COLORS.red_14}
            style={styles.iconRight}
          />
        ) : props.nameIconRight ? (
          <Ionicons
            name={props.nameIconRight}
            size={props.sizeIcon}
            color={COLORS.grey_7}
            style={styles.iconRight}
            onPress={props.onAction}
          />
        ) : (
          <View />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    width: "80%",
    height: windowHeight / 13,
    borderColor: COLORS.grey_5,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.light,
    marginTop: 15,
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
  iconRight: {
    paddingRight: 10,
  },
});

export default InputIcon;
