import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../constants/color";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatShowDate } from "../utils/Common";

const MissionOrder = ({ data }) => {
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const receivedTime = data.receivedTime
    ? formatShowDate(data.receivedTime)
    : "00:00 00/00/0000";
  return (
    <TouchableOpacity
      style={styles.cardOrder}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("DetailMission", {
          data: data,
        })
      }
    >
      {/* Thông tin cửa hàng */}
      <View style={styles.borderBottom}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          {receivedTime}
          <Text>
            {" "}
            - <Text style={{ color: COLORS.red_13 }}>Đã chấp nhận</Text>
          </Text>
        </Text>
        <View style={{ marginTop: 5 }}>
          <Text>
            <Entypo name="shop" size={20} color={COLORS.red_13} />{" "}
            <Text style={{ fontWeight: "bold" }}>{data.shopName}</Text> -{" "}
            {data.shopAddress}
            <Text></Text>
          </Text>
        </View>
      </View>
      {/* Thông tin người nhận */}
      <View style={{ ...styles.borderBottom, borderBottomColor: COLORS.light }}>
        <Text>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={COLORS.red_13}
          />{" "}
          <Text style={{ fontWeight: "bold" }}>{data.customerName}</Text> -{" "}
          {data.customerAddress}
          <Text></Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  borderBottom: {
    paddingVertical: 10,
    borderBottomColor: COLORS.grey_4,
    borderBottomWidth: 1,
  },
  buttonAction: {
    width: 150,
    paddingVertical: 8,
    borderRadius: 15,
  },
  titleButton: {
    textAlign: "center",
    color: COLORS.light,
    fontSize: 15,
  },
  cardOrder: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 15,
    padding: 10,
    elevation: 5,
    marginTop: 5,
    position: "relative",
    margin: 10,
  },
});

export default MissionOrder;
