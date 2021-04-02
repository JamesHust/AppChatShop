import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>This is a UserScreen</Text>
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

export default UserScreen;
