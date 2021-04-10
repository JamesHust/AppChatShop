import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  ScrollView,
} from "react-native";
import Suggest from "./Suggest";

const ListSuggest = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item, index) => <Suggest key={index} data={item} />)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListSuggest;
