import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import COLORS from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import { addDotToNumber, formatDateTime } from "../utils/Common";

const DetailMonitorScreen = (props) => {
  const navigation = useNavigation();
  let img = null;
  let status = "";
  if (props.data.status == 5) {
    img = require("../assets/status-order/clipboard.png");
    status = " Hủy đơn hàng";
  } else if (props.data.status == 6) {
    img = require("../assets/status-order/report.png");
    status = "Thất bại";
  } else if (props.data.status == 3 || props.data.status == 4) {
    img = require("../assets/status-order/tick.png");
    status = "Thành công";
  } else if (props.data.status == 2) {
    img = require("../assets/status-order/delivery-man.png");
    status = "Đang giao hàng";
  } else if (props.data.status == 1) {
    img = require("../assets/status-order/check-mark.png");
    status = "Đã xác nhận";
  } else {
    img = require("../assets/status-order/ethics.png");
    status = "Đang xử lý";
  }

  // Hàm chuyển hướng sang chi tiết đơn hàng
  const navigationDetail = () => {
    if (+props.data.status > 2) {
      navigation.navigate("DetailComplete", {
        orderId: props.data.orderId,
        lastStep: status,
      });
    } else {
      navigation.navigate("DetailMonitor", { orderId: props.data.orderId });
    }
  };
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={navigationDetail}>
      <View style={styles.cardWishlist}>
        <View style={styles.infoContainer}>
          <Image source={img} resizeMode="contain" style={styles.img} />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.statusText}>{status}</Text>
            <Text>
              Mã đơn hàng:{" "}
              <Text style={styles.customInfo}>{props.data.orderCode}</Text>
            </Text>
            <Text>
              Tổng tiền:{" "}
              <Text style={styles.customInfo}>
                {addDotToNumber(+props.data.total + 15000)}₫
              </Text>
            </Text>
            {+props.data.status > 2 ? (
              <Text>
                Cập nhật lần cuối:{" "}
                <Text style={styles.customInfo}>
                  {formatDateTime(props.data.modifyDate)}
                </Text>
              </Text>
            ) : (
              <Text>
                Ngày đặt:{" "}
                <Text style={styles.customInfo}>
                  {formatDateTime(props.data.createDate)}
                </Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWishlist: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 8,
    marginHorizontal: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 75,
    height: 75,
  },
  statusText: {
    color: COLORS.red_13,
    fontWeight: "bold",
    fontSize: 17,
    fontStyle: "italic",
  },
  customInfo: {
    color: COLORS.dark,
  },
});

export default DetailMonitorScreen;
