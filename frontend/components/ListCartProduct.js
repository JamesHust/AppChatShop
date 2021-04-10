import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CartProduct from "./CartProduct";

const ListCartProduct = (props) => {
  return (
    <View style={styles.listProduct}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={props.data}
        renderItem={(item) => <CartProduct data={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listProduct: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 8,
  },
});

export default ListCartProduct;
