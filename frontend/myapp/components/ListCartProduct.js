import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CardProduct from "./CardProduct";

const ListCardProduct = (props) => {
  return (
    <View style={styles.listProduct}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={props.data}
        renderItem={(item) => <CardProduct data={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listProduct: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 8,
  },
});

export default ListCardProduct;
