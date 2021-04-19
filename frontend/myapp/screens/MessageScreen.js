import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import messages from "../data/messages";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import CardChat from "../components/CardChat";

// Màn hình trò chuyện
const ChatScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar và tên của tài khoản */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{uri: 'https://i.pinimg.com/564x/ff/14/64/ff1464ed8de987ec456a41a7345e822d.jpg'}}
            resizeMode="cover"
            style={styles.avatarUser}
          />
          <Text style={styles.nameUser}>Thế Hưng</Text>
        </View>
        <Ionicons name="settings-sharp" size={24} color="black" />
      </View>
      {/* Tìm kiếm liên hệ */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={18} color={COLORS.dark} />
        <TextInput
          placeholder="Tìm kiếm cửa hàng, liên hệ..."
          style={{ marginLeft: 5 }}
        />
      </View>
      {/* Bảng chat gần đây */}
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Chat", { data: item })}
            >
              <CardChat
                avatar={item.avatar}
                name={item.name}
                time={item.time}
                messageText={item.messageText}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarUser: {
    borderRadius: 100,
    height: 35,
    width: 34,
  },
  searchContainer: {
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: COLORS.grey_3,
    paddingHorizontal: 10,
    borderRadius: 15,
    height: 42,
    alignItems: "center",
  },
  nameUser: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 24,
    color: COLORS.dark,
  },
});

export default ChatScreen;
