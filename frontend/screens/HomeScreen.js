import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Gradient from "../components/Gradient";

const HomeScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>This is a Homepage</Text>
      <Gradient colors={['#4c669f', '#3b5998', '#192f6a']}><Text>Hello</Text></Gradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
