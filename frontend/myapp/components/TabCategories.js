import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../constants/color";

const TabCategories = (props) => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  return (
    <View style={styles.container}>
      {props.listCategory.map((item, index) => (
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => setCategoryIndex(index)}>
          <Text
            style={[
              styles.categoryText,
              categoryIndex == index && styles.categotyTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  categotyTextSelected: {
    color: COLORS.red_13,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.orange_14,
  },
});

export default TabCategories;
