import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/color";

const QueueOrder = ({ data }) => {
  return (
    <View style={styles.cardOrder}>
      {/* Thông tin cửa hàng */}
      <View style={styles.borderBottom}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          12 th5, 03:05PM<Text> - Lấy đơn</Text>
        </Text>
        <Text>
          <Text>{data.shopName}</Text> - {data.shopAddress}
          <Text></Text>
        </Text>
      </View>
      {/* Thông tin người nhận */}
      <View style={styles.borderBottom}>
        <Text>
          <Text>{data.customerName}</Text> - {data.customerAddress}
          <Text></Text>
        </Text>
      </View>
      {/* Action */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{
            ...styles.buttonAction,
            backgroundColor: COLORS.red_13,
          }}
        >
          <Text style={styles.titleButton}>Bỏ qua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.buttonAction,
            backgroundColor: COLORS.green_6,
          }}
        >
          <Text style={styles.titleButton}>Chấp nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: COLORS.light,
    borderRadius: 15,
    padding: 10,
    elevation: 5,
    marginTop: 20,
  },
});

export default QueueOrder;
