import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import COLORS from "../constants/color";
import CardMonitorOrder from "./CardMonitorOrder";

const DetailMonitorScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item) => (
          <CardMonitorOrder key={item.orderId} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
});

export default DetailMonitorScreen;
