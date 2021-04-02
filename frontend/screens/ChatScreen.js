import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>This is a ChatScreen</Text>
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

export default ChatScreen;
