import React, { useEffect, useCallback, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import CardChat from "../components/CardChat";
import { useSelector, useDispatch } from "react-redux";
import * as boardChatActions from "../redux/actions/board-chat";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

// Màn hình trò chuyện
const ChatScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.authReducer.customer);
  const boardChat = useSelector((state) => state.boardChatReducer.boardChat);
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu

  // Header của trang
  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: customer.avatar }}
            resizeMode="cover"
            style={styles.avatarUser}
          />
          <Text style={styles.nameUser}>{customer.customerName}</Text>
        </View>
        <Ionicons name="settings-sharp" size={24} color="black" />
      </View>
    );
  };

  // Hàm lấy danh sách phòng chat
  const getBoardRoomChat = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      dispatch(boardChatActions.getBoardChat(customer.customerId, token));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadWishList(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, [setIsLoading]);

  // Hàm theo dõi sự thay đổi để load lại bảng danh sách phòng chat
  useEffect(() => {
    getBoardRoomChat();
  }, [dispatch, getBoardRoomChat, setIsLoading]);

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Tìm kiếm liên hệ */}
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={18} color={COLORS.dark} />
          <TextInput
            placeholder="Tìm kiếm cửa hàng, liên hệ..."
            style={{ marginLeft: 5 }}
          />
        </View>
        <View style={styles.containerCenter}>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar và tên của tài khoản */}
      <Header />
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
          data={boardChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.shopId}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("Chat", {
                  data: item,
                  customerId: customer.customerId,
                });
              }}
            >
              <CardChat
                avatar={item.avatar}
                name={item.shopName}
                activeStatus={item.activeStatus}
                messageText={item.finalTextMessage}
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
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
