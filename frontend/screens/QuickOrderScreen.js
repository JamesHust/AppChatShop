import React from "react";
import { View, Text, StyleSheet } from "react-native";

const QuickOrderScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>This is a QuickOrderScreen</Text>
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

export default QuickOrderScreen;
