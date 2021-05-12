import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

const DebtScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is page DebtScreen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DebtScreen;

