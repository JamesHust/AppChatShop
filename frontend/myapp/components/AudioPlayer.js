import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const AudioPlayer = (props) => {
    const [playing, setPlaying] = useState(initialState)
  return (
    <View style={styles.container}>
      <Text>This is a AudioPlayer</Text>
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

export default AudioPlayer;
