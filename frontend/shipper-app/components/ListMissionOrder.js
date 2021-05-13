import React from "react";
import * as Animatable from "react-native-animatable";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import MissionOrder from "./MissionOrder";

const ListMissionOrder = (props) => {
  return (
    <Animatable.View animation="fadeInUpBig" style={styles.container}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item) => (
          <MissionOrder key={item.orderShipCode} data={item} />
        ))}
      </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListMissionOrder;
