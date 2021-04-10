import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  ScrollView,
} from "react-native";
import COLORS from "../constants/color";
import ItemMenu from "./ItemMenu";

const Menu = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map(item => <ItemMenu key={item.id} data={item} />)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default Menu;
