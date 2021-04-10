import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const Suggest = (props) => {
  return (
    <View>
      <View style={styles.boxImg}>
        <Image source={props.data.img} style={styles.img} resizeMode="cover" />
      </View>
      <View>
        <Text
          style={{
            color: COLORS.orange_14,
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 5,
          }}
        >
          KHUYẾN MÃI
        </Text>
        <Text
          style={{
            marginRight: 15,
            fontSize: 13,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {props.data.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: COLORS.grey_7 }}>{props.data.cate}</Text>
          <Entypo
            name="dot-single"
            size={18}
            color={COLORS.grey_6}
            style={{ marginTop: 2 }}
          />
          <AntDesign name="star" size={13} color={COLORS.amber} />
          <Text style={{ fontWeight: "bold", marginHorizontal: 2 }}>
            {props.data.rating}
          </Text>
          <Text style={{ fontWeight: "bold", color: COLORS.grey_6 }}>
            ({props.data.sold})
          </Text>
        </View>
        <View>
            
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxImg: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 15,
  },
  img: {
    width: 220,
    height: 120,
    borderRadius: 15,
  },
});

export default Suggest;
