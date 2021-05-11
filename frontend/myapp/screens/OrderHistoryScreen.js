import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import orders from "../data/orders";
import ListMonitorOrder from "../components/ListMonitorOrder";

const OrderHistoryScreen = ({ navigation }) => {
  // Component header
  const Header = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* Header */}
        <View>
          <TouchableOpacity
            onPress={() => navigation.popToTop()}
            style={styles.iconBack}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
          </TouchableOpacity>
          <View style={styles.title}>
            <Text style={styles.titleScreen}>Đơn hàng hoàn thành</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Thanh tìm kiếm đơn hàng */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={18} color={COLORS.dark} />
        <TextInput
          placeholder="Tìm kiếm theo mã đơn hàng"
          style={{ marginLeft: 5 }}
        />
      </View>
      {/* Nội dung của trang */}
      <View style={styles.content}>
        <ListMonitorOrder data={orders} showsVerticalScrollIndicator={true} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    position: "relative",
  },
  iconBack: {
    position: "absolute",
    zIndex: 1,
    top: 15,
    left: 15,
  },
  title: {
    marginTop: 12,
  },
  titleScreen: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.grey_3,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    height: 42,
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginTop: 10,
    paddingTop: 10,
    backgroundColor: COLORS.grey_3
  },
});

export default OrderHistoryScreen;
