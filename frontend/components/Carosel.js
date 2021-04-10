import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import COLORS from "../constants/color";

const Carosel = (props) => {
  return (
    <View style={styles.container}>
      <Swiper autoplay={props.autoplay} height={props.height} horizontal={props.horizontal} backgroundColor={COLORS.grey_4} activeDotColor={COLORS.orange_14}>
        {props.listImg.map((item, index) => (
          <View key={index}>
            <Image source={item.img} resizeMode="cover" style={styles.img} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    overflow: 'hidden'
  },
});

export default Carosel;
