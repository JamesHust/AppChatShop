import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import ItemMenu from "./ItemMenu";

//Danh sách menu
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
