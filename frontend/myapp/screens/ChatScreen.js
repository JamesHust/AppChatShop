import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LogBox,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import ModalOrderSuccess from "../components/ModalOrderSuccess";
import COLORS from "../constants/color";
import * as ImagePicker from "expo-image-picker";
import RecognizeVoice from "../modules/RecognizeVoice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast, addDotToNumber } from "../utils/Common";
import * as boardChatActions from "../redux/actions/board-chat";
import * as cartActions from "../redux/actions/cart";

const uuidv4 = require("uuid/v4");

const ChatScreen = ({ route, navigation }) => {
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  const data = route.params.data;
  const customerId = route.params.customerId;
  const shopId = route.params.shopId;
  const [messages, setMessages] = useState([]);
  const quickCart = useSelector((state) => state.cartReducer.quickCart);
  const totalPaymentQuickCart = useSelector(
    (state) => state.cartReducer.totalPaymentQuickCart
  );
  const [suggestModalVisible, setSuggestModalVisible] = useState(false); //xét hiển thị modal gợi ý sản phẩm
  const [quickCartModalVisible, setQuickCartModalVisible] = useState(false); //xét hiển thị modal giỏ hàng nhanh
  const [noticeModalVisible, setNoticeModalVisible] = useState(false); //xét hiển thị modal cảnh báo khi có sản phẩm của cửa hàng khác trong giỏ
  const [supportModalVisible, setSupportModalVisible] = useState(false); //xét hiển thị modal hỗ trợ khách hàng
  const [visibleOrderSuccess, setVisibleOrderSuccess] = useState(false); // xét hiển thị đặt hàng thành công
  const [noticeOutOfStock, setNoticeOutOfStock] = useState(false); // xét hiển thị sản phẩm trong kho đã hết
  const [suggestProduct, setSuggestProduct] = useState([]);
  const [newProduct, setNewProduct] = useState(null); //sản phẩm mới của cửa hàng khác
  const [listOutOfStock, setListOutOfStock] = useState([]); //danh sách sản phẩm hết hàng
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

  // Xử lý gửi request lưu tin nhắn lên server. type: là kiểu nhập tin nhắn : enter, voice
  const handleSend = async (type, token, messageSend) => {
    const response = await fetch(`http://192.168.1.125:3000/api/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        packageMess: messageSend,
        actor: "customer",
        roomId: data.roomId,
        shopId: shopId,
        type: type,
      }),
    });
    return response;
  };

  //Hàm thêm tin nhắn vào mảng message
  const onSend = useCallback(async (messages = [], type) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await handleSend(type, token, messages[0]);
      // Nếu thêm tin nhắn thành công
      if (response.status === 200) {
        // Lấy dữ liệu trả về
        const resData = await response.json();
        if (resData.data) {
          const typeData = typeof resData.data;
          if (typeData === "object") {
            //trường hợp là object hoặc mảng
            if (resData.data.length) {
              //trường hợp là mảng
              setSuggestProduct(resData.data);
              setSuggestModalVisible(true);
            } else {
              //trường hợp là object
              if (quickCart.length > 0) {
                // Kiểm tra có trùng Id cửa hàng
                if (quickCart[0].shopId === resData.data.shopId) {
                  dispatch(cartActions.addOrUpdateQuickCart(resData.data));
                  showToast("Thêm sản phẩm vào giỏ hàng nhanh thành công!");
                } else {
                  setNewProduct(resData.data);
                  // Hỏi khách hàng muốn xóa giỏ hàng cũ không?
                  setNoticeModalVisible(true);
                }
              } else {
                dispatch(cartActions.addOrUpdateQuickCart(resData.data));
                showToast("Thêm sản phẩm vào giỏ hàng nhanh thành công!");
              }
            }
          } else {
            //trường hợp là string
            showToast(resData.data);
          }
        }
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
      onSend(msg, "enterKeyboard");
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

  // Xử lý bật mic
  const startVoice = async () => {
    const text = await RecognizeVoice.startVoice();
    if (text) {
      const messageVoice = [
        {
          _id: uuidv4(),
          createdAt: new Date(),
          text: text,
          user: { _id: 1 },
        },
      ];
      onSend(messageVoice, "voice");
    } else {
      showToast("Không nhận được văn bản giọng nói");
    }
  };

  //Custom lại phần các action cho left icon bổ sung
  const renderLeftIcon = () => {
    return (
      <View style={styles.listAction}>
        {/* Gửi ảnh */}
        <TouchableOpacity onPress={chooseImage}>
          <Ionicons
            name="image"
            size={26}
            color={COLORS.red_13}
            style={{ paddingHorizontal: 8 }}
          />
        </TouchableOpacity>
        {/* Hỗ trợ */}
        <TouchableOpacity>
          <AntDesign
            name="customerservice"
            size={26}
            style={{
              paddingHorizontal: 8,
              paddingLeft: 10,
              textAlign: "center",
            }}
            color={COLORS.red_13}
            onPress={() => setSupportModalVisible(true)}
          />
        </TouchableOpacity>
        {/* Đặt hàng bằng mic */}
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

  // Hàm show thông báo đặt hàng thành công
  const showSuccessNotification = () => {
    setVisibleOrderSuccess(true);
    setTimeout(() => {
      setVisibleOrderSuccess(false);
    }, 3000);
  };

  // Hàm xử lý khi chọn 1 sản phẩm gợi ý
  const selectSuggestHandler = (item) => {
    if (quickCart.length > 0) {
      if (item.shopId === quickCart[0].shopId) {
        // thực hiện thêm sản phẩm vào giỏ
        dispatch(cartActions.addOrUpdateQuickCart(item));
        // Đóng modal
        setSuggestModalVisible(false);
        showToast("Thêm sản phẩm vào giỏ hàng nhanh thành công!"); // thông báo thêm thành công
        // Cập nhật lại rỗng danh sách gợi ý
        setSuggestProduct([]);
      } else {
        setNewProduct(item);
        // Hỏi xem khách hàng có muốn xóa giỏ hàng cũ không
        setNoticeModalVisible(true);
      }
    } else {
      // thực hiện thêm sản phẩm vào giỏ
      dispatch(cartActions.addOrUpdateQuickCart(item));
      // Đóng modal
      setSuggestModalVisible(false);
      showToast("Thêm sản phẩm vào giỏ hàng nhanh thành công!"); // thông báo thêm thành công
      // Cập nhật lại rỗng danh sách gợi ý
      setSuggestProduct([]);
    }
  };

  // Hàm xóa toàn bộ giỏ hàng cũ và thêm sản phẩm cửa hàng khác vào giỏ
  const removeAndAddProdQuickCart = () => {
    if (newProduct) {
      // Thực hiện xóa giỏ
      dispatch(cartActions.removeAllQuickCart());
      // Thực hiện thêm sản phẩm mới vào giỏ
      dispatch(cartActions.addOrUpdateQuickCart(newProduct));
      // Đóng modal
      setNoticeModalVisible(false);
      // Set lại sản phẩm mới của cửa hàng khác là null
      setNewProduct(null);
      showToast("Thêm sản phẩm vào giỏ hàng nhanh thành công!");
    } else {
      Alert.alert("goFAST", `Lỗi chưa lấy được thông tin sản phẩm mới`, [
        {
          text: "Ok",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm xóa sản phẩm trong giỏ hàng nhanh
  const removeProductInQuickCart = (productId) => {
    if (productId) {
      dispatch(cartActions.removeProdInQuickCart(productId));
      showToast("Xóa sản phẩm khỏi giỏ hàng nhanh thành công");
    } else {
      Alert.alert("goFAST", `Lỗi chưa lấy được Id sản phẩm cần xóa`, [
        {
          text: "Ok",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm xử lý đặt hàng giỏ hàng nhanh
  const handlerOrderQuickCart = async () => {
    if (quickCart.length > 0) {
      try {
        const token = await AsyncStorage.getItem("userToken");
        // Thực hiện gửi request lên server
        const response = await fetch(
          "http://192.168.1.125:3000/api/quick/orders",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              quickCart: quickCart,
              customerId: customerId,
              shopId: shopId,
              totalPayment: totalPaymentQuickCart,
            }),
          }
        );

        switch (response.status) {
          case 200:
            const resData = await response.json();
            if (resData.isSuccess) {
              setQuickCartModalVisible(false); //đóng giỏ hàng nhanh
              dispatch(cartActions.removeAllQuickCart());
              showSuccessNotification(); //hiển thị thông báo thành công
            } else {
              setListOutOfStock(resData.data);
              setNoticeOutOfStock(true);
            }
            return;
          default:
            Alert.alert("goFAST", `Lỗi đặt hàng:`, [
              {
                text: "Thực hiện lại",
                onPress: () => handlerOrderQuickCart(),
              },
              {
                text: "OK",
                style: "cancel",
              },
            ]);
            return;
        }
      } catch (err) {
        Alert.alert("goFAST", `Lỗi đặt hàng giỏ hàng nhanh: ${err}`, [
          {
            text: "Thực hiện lại",
            onPress: () => handlerOrderQuickCart(),
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]);
      }
    } else {
      showToast(
        `Giỏ hàng nhanh của bạn đang trống. Vui lòng thêm sản phẩm mới vào giỏ để đặt hàng.`
      );
    }
  };

  // Modal hiển thị danh sách sản phẩm đề xuất
  const SuggestModal = (props) => {
    if (suggestProduct.length <= 0) {
      return (
        <View style={styles.content}>
          <AntDesign
            name="closecircleo"
            size={24}
            color={COLORS.light}
            style={styles.iconClose}
            onPress={() => setSuggestModalVisible(false)}
          />
          <Text style={styles.contentTitle}>Ý của bạn là 🤔</Text>
        </View>
      );
    }
    return (
      <View style={styles.content}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setSuggestModalVisible(false)}
        />
        <Text style={styles.contentTitle}>Ý của bạn là 🤔</Text>
        <FlatList
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            paddingHorizontal: 15,
          }}
          data={suggestProduct}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => selectSuggestHandler(item)}
            >
              <View style={styles.containerSelect}>
                <Image
                  source={{ uri: item.imageUrl }}
                  resizeMode="contain"
                  style={styles.imgModal}
                />
                <View style={{ marginLeft: 5 }}>
                  <Text
                    style={{ color: COLORS.dark, width: 200 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.productName}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ marginRight: 10 }}>
                      Giá :{" "}
                      <Text style={{ color: COLORS.dark, fontWeight: "bold" }}>
                        {addDotToNumber(item.purchasePrice)}
                      </Text>
                    </Text>
                    <Text style={{ color: COLORS.red_13, fontWeight: "bold" }}>
                      x{item.productAmount}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Modal hiển thị giỏ hàng đặt nhanh
  const QuickCart = (props) => {
    if (quickCart.length <= 0) {
      return (
        <View style={{ ...styles.content, height: 400 }}>
          <AntDesign
            name="closecircleo"
            size={24}
            color={COLORS.light}
            style={styles.iconClose}
            onPress={() => setQuickCartModalVisible(false)}
          />
          <Text
            style={{ ...styles.contentTitle, width: 280 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Tổng tiền: {addDotToNumber(totalPaymentQuickCart)}
          </Text>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.light,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                paddingHorizontal: 55,
              }}
            >
              Không có sản phẩm
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{ ...styles.content, height: 400 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setQuickCartModalVisible(false)}
        />
        <Text
          style={{ ...styles.contentTitle, width: 280 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Tổng tiền: {addDotToNumber(totalPaymentQuickCart)}
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.light,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            style={{
              borderRadius: 15,
              paddingHorizontal: 15,
              marginVertical: 10,
            }}
            data={quickCart}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => (
              <View
                style={{
                  ...styles.containerSelect,
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.containerSelect}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    resizeMode="contain"
                    style={styles.imgModal}
                  />
                  <View style={{ marginLeft: 5 }}>
                    <Text
                      style={{ color: COLORS.dark, width: 200 }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.productName}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ marginRight: 10 }}>
                        Giá :{" "}
                        <Text
                          style={{ color: COLORS.dark, fontWeight: "bold" }}
                        >
                          {addDotToNumber(item.purchasePrice)}
                        </Text>
                      </Text>
                      <Text
                        style={{ color: COLORS.red_13, fontWeight: "bold" }}
                      >
                        x{item.productAmount}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={COLORS.red_13}
                    onPress={() => removeProductInQuickCart(item.productId)}
                  />
                </View>
              </View>
            )}
          />
          <View
            style={{
              width: 290,
              paddingBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.dark }}>
              Phí ship:{" "}
              <Text
                style={{
                  color: COLORS.red_13,
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                15,000
              </Text>
            </Text>
            <View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: COLORS.red_13,
                  borderRadius: 15,
                }}
                onPress={handlerOrderQuickCart}
              >
                <Text style={{ color: COLORS.light, fontSize: 16 }}>
                  Đặt mua
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Modal hiển thị cảnh báo xóa giỏ hàng khi trong giỏ có sản phẩm của cửa hàng khác
  const NoticeRemoveQuickCart = (props) => {
    return (
      <View style={{ ...styles.content, height: 185 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setNoticeModalVisible(false)}
        />
        <Text style={styles.contentTitle}>⚠️ Chú ý</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
          }}
        >
          <Text>
            Giỏ hàng nhanh đang chứa sản phẩm của cửa hàng khác. Bạn có muốn
            tiếp tục thêm sản phẩm vào giỏ?
          </Text>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setNoticeModalVisible(false)}
              style={{
                ...styles.button,
                backgroundColor: COLORS.light,
                borderColor: COLORS.grey_6,
                borderWidth: 1,
              }}
            >
              <Text>Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={removeAndAddProdQuickCart}
            >
              <Text style={{ color: COLORS.light }}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Modal hiển thị cảnh báo xóa giỏ hàng khi trong giỏ có sản phẩm của cửa hàng khác
  const SupportModal = (props) => {
    return (
      <View style={{ ...styles.content, height: 290 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setSupportModalVisible(false)}
        />
        <Text style={styles.contentTitle}>📜 Hỗ trợ khách hàng</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            1. Đặt hàng bằng cú pháp:{" "}
            <Text style={{ fontWeight: "bold" }}>
              DAT_#[Mã sản phẩm]_[Số lượng]
            </Text>
            . VD: <Text style={{ fontWeight: "bold" }}>DAT_#SP00001_15</Text>.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Text>2. Đặt hàng bằng giọng nói: Chọn biểu tượng</Text>
            <Image
              style={{ marginLeft: 5, width: 20, height: 20 }}
              source={require("../assets/micro.png")}
              resizeMode="contain"
            />
            <Text>
              Sau đó nói theo cú pháp:{" "}
              <Text style={{ fontWeight: "bold" }}>
                ĐẶT [Số lượng] [Đơn vị] [Tên sản phẩm].
              </Text>
            </Text>
          </View>
          <Text style={{ marginBottom: 10 }}>
            3. Liên hệ tổng đài{" "}
            <Text style={{ color: COLORS.red_13, fontWeight: "bold" }}>
              0966073028
            </Text>{" "}
            để giải đáp thắc mắc khác.
          </Text>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSupportModalVisible(false)}
            >
              <Text style={{ color: COLORS.light }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Modal hiển thị thông báo sản phẩm trong kho đã hết
  const NoticeOutOfStockModal = (props) => {
    return (
      <View style={{ ...styles.content, height: 325 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setNoticeOutOfStock(false)}
        />
        <Text style={styles.contentTitle}>Thông báo 🤷🤷‍♂️</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>
              Số lượng sản phẩm bạn mua vượt quá kho hàng của cửa hàng. Số lượng
              sản phẩm còn:{" "}
            </Text>
            <View style={{ height: 95, marginTop: 10 }}>
              <FlatList
                data={listOutOfStock}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.ProductId}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Entypo name="dot-single" size={24} color={COLORS.dark} />
                    <Text>
                      {item.ProductName} : {item.Amount} {item.Unit}
                    </Text>
                  </View>
                )}
              />
            </View>
            <Text style={{ marginTop: 15 }}>
              🙆‍♂️🙆Vui lòng chọn lại số lượng sản phẩm cần mua!
            </Text>
          </View>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => setNoticeOutOfStock(false)}
            >
              <Text style={{ color: COLORS.light }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal hiển thị đặt hàng thành công */}
      <ModalOrderSuccess
        onVisible={visibleOrderSuccess}
        backdropColor={COLORS.light}
      />
      {/* Modal hỗ trợ khách hàng */}
      <Modal isVisible={supportModalVisible} backdropColor={COLORS.grey_9}>
        <SupportModal />
      </Modal>
      {/* Modal cảnh báo xóa giỏ hàng khi trong giỏ có sản phẩm của cửa hàng khác */}
      <Modal isVisible={noticeModalVisible} backdropColor={COLORS.grey_9}>
        <NoticeRemoveQuickCart />
      </Modal>
      {/* Modal hiển thị danh sách giỏ hàng nhanh và đặt hàng */}
      <Modal
        style={styles.containerModal}
        isVisible={quickCartModalVisible}
        backdropColor={COLORS.grey_9}
        animationIn="slideInLeft"
        animationOut="slideOutRight"
      >
        <QuickCart />
      </Modal>
      {/* Modal thông báo sản phẩm trong kho đã hết hàng */}
      <Modal isVisible={noticeOutOfStock} backdropColor={COLORS.grey_9}>
        <NoticeOutOfStockModal />
      </Modal>
      {/* Modal hiển thị gọi ý chọn sản phẩm */}
      <Modal
        style={styles.containerModal}
        isVisible={suggestModalVisible}
        backdropColor={COLORS.grey_9}
        backdropOpacity={0.6}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <SuggestModal />
      </Modal>
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
        {/* Chức năng hỗ trợ */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Gọi điện hỗ trợ từ cửa hàng */}
          <MaterialIcons
            name="call"
            size={28}
            style={{ marginRight: 18 }}
            color={COLORS.red_13}
            onPress={showSuccessNotification}
          />
          {/* Tiến hàng mua hàng */}
          <FontAwesome5
            name="shopping-bag"
            size={24}
            color={COLORS.red_13}
            onPress={() => setQuickCartModalVisible(true)}
          />
        </View>
      </View>
      {/* Phần chat */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages, "enterKeyboard")}
        user={{
          _id: 1,
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
  // Css cho modal
  containerModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  containerSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.grey_4,
    borderBottomWidth: 1,
  },
  content: {
    backgroundColor: COLORS.red_13,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 15,
    borderColor: COLORS.red_13,
    height: 290,
    position: "relative",
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginLeft: 5,
    color: COLORS.light,
    fontWeight: "bold",
  },
  imgModal: {
    height: 60,
    width: 60,
  },
  iconClose: {
    zIndex: 1,
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 99,
  },
  // Css cho màn hình chính
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
  button: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: COLORS.red_13,
    fontSize: 15,
    marginLeft: 10,
    borderRadius: 15,
  },
});

export default ChatScreen;
