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
        keyExtractor={(item, index) => index}
        renderItem={(item) => (
          <View style={{flex: 1}}>
            <CardProduct data={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listProduct: {
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 5,
  },
});

export default ListCardProduct;
