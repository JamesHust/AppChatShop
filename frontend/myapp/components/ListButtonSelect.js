import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ButtonSelectSearch from "./ButtonSelectSearch";

const ListButtonSelect = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item, index) => (
          <ButtonSelectSearch key={index} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      paddingBottom: 15
  },
});

export default ListButtonSelect;
