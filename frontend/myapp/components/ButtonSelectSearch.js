import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import COLORS from "../constants/color";

const ButtonSelectSearch = (props) => {
  const [isSearch, setIsSearch] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setIsSearch(!isSearch)}
    >
      <View
        style={isSearch ? styles.buttonContainerActive : styles.buttonContainer}
      >
        <Image source={props.data.image} style={styles.image} />
        <Text style={isSearch ? styles.nameActive : styles.name}>
          {props.data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.grey_3,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.grey_4,
  },
  buttonContainerActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.red_12,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.red_13,
  },
  image: {
    height: 20,
    width: 20,
  },
  name: {
    marginLeft: 5,
    fontSize: 16,
    color: COLORS.dark,
  },
  nameActive: {
    marginLeft: 5,
    fontSize: 16,
    color: COLORS.light,
  },
});

export default ButtonSelectSearch;
