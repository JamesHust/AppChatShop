import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/color";
import { formatDateTime, showToast } from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const QueueOrder = (props) => {
  return (
    <View style={styles.cardOrder}>
      {/* Thông tin cửa hàng */}
      <View style={styles.borderBottom}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          {formatDateTime(new Date())}<Text> - Lấy đơn</Text>
        </Text>
        <Text>
          <Text>{props.data.shopName}</Text> - {props.data.shopAddress}
          <Text></Text>
        </Text>
      </View>
      {/* Thông tin người nhận */}
      <View style={styles.borderBottom}>
        <Text>
          <Text>{props.data.customerName}</Text> - {props.data.customerAddress}
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
          onPress={props.ignoreOrder}
        >
          <Text style={styles.titleButton}>Bỏ qua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.buttonAction,
            backgroundColor: COLORS.green_6,
          }}
          onPress={props.handlerReceiveOrder}
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
