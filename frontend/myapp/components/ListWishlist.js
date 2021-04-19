import React from "react";
import { View, ScrollView } from "react-native";
import CardWishlist from "./CardWishlist";
import COLORS from "../constants/color";
import { screenHeight } from "../utils/Dimentions";

const ListWishList = (props) => {
  return (
    <View style={{backgroundColor: COLORS.light, height: screenHeight}}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item, index) => (
          <CardWishlist key={index} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ListWishList;
