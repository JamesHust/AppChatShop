import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../constants/color";

const RatingStar = (props) => {
  const [rating, setRating] = useState(props.rated);
  let stars = [];
  //render danh sách sao
  for (let x = 1; x <= 5; x++) {
    stars.push(
      <TouchableWithoutFeedback key={x} onPress={() => setRating(x)}>
        <AntDesign
          name={x <= rating ? "star" : "staro"}
          size={25}
          color={x <= rating ? COLORS.amber : COLORS.grey_6}
          style={{marginLeft: 3}}
        />
      </TouchableWithoutFeedback>
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RatingStar;
