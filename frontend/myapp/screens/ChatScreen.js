import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LogBox,
  Alert,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import * as ImagePicker from "expo-image-picker";
import RecognizeVoice from "../modules/RecognizeVoice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../utils/Common";
import * as boardChatActions from "../redux/actions/board-chat";

const uuidv4 = require("uuid/v4");

const ChatScreen = ({ route, navigation }) => {
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  const data = route.params.data;
  const customerId = route.params.customerId;
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  // Lấy danh sách tin nhắn
  const getListMessage = useCallback(async () => {
    //fetching data ở đây
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://192.168.1.125:3000/api/messages/room/${data.roomId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setMessages(resData.data);
          return;
        case 404:
          setMessages([]);
          return;
        default:
          Alert.alert("goFAST", `Lỗi tải dữ liệu:`, [
            {
              text: "Tải lại",
              onPress: () => getListMessage(),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getListMessage(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, []);

  //Theo dõi và gọi tới hàm lấy danh sách tin nhắn
  useEffect(() => {
    getListMessage();
  }, [dispatch, getListMessage]);

  //kiểm tra quyền truy cập máy ảnh và thư viện
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Xin lỗi, chúng tôi cần quyền cuộn camera để làm việc này!");
        }
      }
    })();
  }, []);

  //Hàm thêm tin nhắn vào mảng message
  const onSend = useCallback(async (messages = []) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://192.168.1.125:3000/api/messages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          packageMess: messages[0],
          actor: "customer",
          roomId: data.roomId,
        }),
      });
      // Nếu thêm tin nhắn thành công
      if (response.status === 200) {
        // Cập nhật lại bảng chat
        const token = await AsyncStorage.getItem("userToken");
        dispatch(boardChatActions.getBoardChat(customerId, token));
        // Thêm tin nhắn mới hiển thị lên giao diện
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );
      } else {
        console.log(messages);
        showToast("Lỗi không gửi được tin nhắn!");
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi gửi tin nhắn: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => getListMessage(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, []);

  //Hàm chọn và gửi ảnh từ máy lên
  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let msg = {
        _id: uuidv4(),
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "test",
        },
        image: result.uri,
      };
      onSend(msg);
    }
  };

  //Custom lại bóng chat
  const renderBubble = (props) => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: COLORS.red_14 },
            marginBottom: 10,
          }}
          textStyle={{ right: { color: COLORS.light } }}
          containerStyle={{ paddingVertical: 20 }}
        />
      </View>
    );
  };

  //Custom lại nut send
  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ borderWidth: 0 }}>
        <Ionicons
          name="send"
          size={23}
          color={COLORS.red_13}
          style={{ marginBottom: 10, marginRight: 10 }}
        />
      </Send>
    );
  };

  //Custom thêm nút scroll xuống cuối tin nhắn
  const scrollToBottomComponent = () => {
    return (
      <MaterialCommunityIcons
        name="chevron-double-down"
        size={22}
        color="black"
      />
    );
  };

  //Custom lại phần input toolbar
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ marginTop: 10 }}
        primaryStyle={styles.inputMessContainer}
        placeholder="Nhập tin nhắn"
      />
    );
  };

  const startVoice = async () => {
    const text = await RecognizeVoice.startVoice();
    console.log("Test ABCDEF :" + text);
    Alert.alert("Test Mic : " + text);
  };

  //Custom lại phần các action cho left icon bổ sung
  const renderLeftIcon = () => {
    return (
      <View style={styles.listAction}>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={26}
            color={COLORS.red_13}
            style={{
              paddingHorizontal: 8,
              paddingLeft: 10,
              textAlign: "center",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons
            name="video-collection"
            size={26}
            color={COLORS.red_13}
            style={{ paddingHorizontal: 8 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={chooseImage}>
          <Ionicons
            name="image"
            size={26}
            color={COLORS.red_13}
            style={{ paddingHorizontal: 8 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={startVoice}>
          <Ionicons
            name="mic"
            size={26}
            color={COLORS.red_13}
            style={{ paddingHorizontal: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Phần header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.popToTop()}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
          </TouchableOpacity>
          <Image
            source={{ uri: data.avatar }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <View style={styles.title}>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: COLORS.dark }}
            >
              {data.shopName}
            </Text>
            <Text>{data.activeStatus}</Text>
          </View>
        </View>
        <MaterialIcons name="call" size={28} color={COLORS.red_13} />
      </View>
      {/* Phần chat */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          name: "Hưng",
        }}
        isAnimated
        renderBubble={renderBubble}
        alwaysShowSend={true}
        renderSend={renderSend}
        scrollToBottom={true}
        scrollToBottomComponent={scrollToBottomComponent}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderLeftIcon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.grey_5,
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    height: 38,
    width: 38,
    borderRadius: 200,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
  },
  title: {
    marginLeft: 10,
  },
  listAction: {
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default ChatScreen;
