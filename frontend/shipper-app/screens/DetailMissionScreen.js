import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import COLORS from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { formatShowDate, addDotToNumber, showToast } from "../utils/Common";
import Modal from "react-native-modal";
import configData from "../config/config.json";

const DetailMissonScreen = (props) => {
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const [isLoading, setIsLoading] = useState(true); //biến check đang tải dữ liệu
  const [listProduct, setListProduct] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [visibleReasonModal, setVisibleReasonModal] = useState(false); //Ẩn hiện modal lý do hủy đơn hàng
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [notification, setNotification] = useState("");
  const { data } = props.route.params;

  // hàm lấy chi tiết đơn hàng
  const loadDetailOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}orders/detail?orderId=${data.orderId}`,
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
          setListProduct(resData.data[0].products);
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          Alert.alert("goFAST", `Lỗi lấy chi tiết dữ liệu`, [
            {
              text: "Tải lại",
              onPress: () => loadDetailOrder(),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadDetailOrder(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  }, []);

  // Hàm gọi để load chi tiết đơn hàng
  useEffect(() => {
    loadDetailOrder();
  }, []);

  // Hàm xóa đơn hàng đang giao
  const deleteDeliveryOrder = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `${configData.SERVER_URL}delivery/${data.orderId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    return response.status;
  };

  // Hàm xử lý khi giao hàng thành công
  const handlerSuccessOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}orders?orderId=${data.orderId}&status=3`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );
      if (response.status === 200) {
        navigation.navigate("SuccessDelive");
      } else {
        showToast("Lỗi hệ thống");
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi gửi dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => handlerSuccessOrder(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Modal thông báo
  const NotificationModal = () => {
    return (
      <View style={{ ...styles.content, height: 195 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setVisibleNotification(false)}
        />
        <Text style={styles.contentTitle}>Thông báo 😵</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
            width: 343,
            height: 140,
          }}
        >
          <Text>{notification}</Text>
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
              onPress={() => setVisibleNotification(false)}
            >
              <Text style={{ color: COLORS.light }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Modal nêu lý do hủy đơn hàng
  const ReasonModal = () => {
    const [noteCancelModal, setNoteCancelModal] = useState(); //Nội dung ghi chú trong lý do hủy đơn hàng

    // Hàm thực hiện hủy đơn hàng
    const cancelOrder = async () => {
      try {
        const reason = noteCancelModal;
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(
          `${configData.SERVER_URL}delivery/cancel`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              reason: reason,
              orderId: data.orderId,
            }),
          }
        );
        if (response.status) {
          setVisibleReasonModal(false);
          navigation.popToTop();
          showToast("Hủy đơn hàng thành công");
        } else {
          showToast("Hủy đơn hàng thất bại");
        }
      } catch (err) {
        Alert.alert("goFAST", `Lỗi hủy đơn hàng: ${err}`, [
          {
            text: "Thực hiện lại",
            onPress: () => cancelOrder(),
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]);
      }
    };

    // Hàm xử lý hành động trên modal lý do hủy đơn hàng
    const handlerAccessCancel = async () => {
      if (noteCancelModal) {
        await cancelOrder();
      } else {
        setNotification("Vui lòng nhập lý do hủy đơn hàng này!");
        setVisibleNotification(true);
      }
    };
    return (
      <View style={{ ...styles.content, height: 212 }}>
        <AntDesign
          name="closecircleo"
          size={24}
          color={COLORS.light}
          style={styles.iconClose}
          onPress={() => setVisibleReasonModal(false)}
        />
        <Text style={styles.contentTitle}>Hủy đơn hàng 😧</Text>
        <View
          style={{
            backgroundColor: COLORS.light,
            borderRadius: 15,
            padding: 15,
            justifyContent: "space-between",
            width: 343,
            height: 160,
          }}
        >
          <TextInput
            multiline={true}
            value={noteCancelModal}
            style={{
              backgroundColor: COLORS.grey_3,
              textAlignVertical: "top",
              borderRadius: 15,
              padding: 10,
            }}
            numberOfLines={4}
            placeholder="Nhập lý do hủy..."
            onChangeText={(value) => setNoteCancelModal(value)}
          />
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
              onPress={handlerAccessCancel}
            >
              <Text style={{ color: COLORS.light }}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Component header
  const Header = () => {
    return (
      <View style={styles.containerHeader}>
        {/* Toggle Menu */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={COLORS.light}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        {/* Ngày tháng hiện tại */}
        <View style={{ flex: 6, alignItems: "center" }}>
          <Text style={styles.textDate}>{data.orderShipCode}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setVisibleReasonModal(true)}
          >
            <MaterialCommunityIcons
              style={{ marginLeft: 10 }}
              name="file-cancel"
              size={28}
              color={COLORS.light}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Trường hợp đang load dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header />
        <View
          style={[
            styles.footer,
            {
              backgroundColor: COLORS.light,
            },
          ]}
        >
          <View style={styles.containerCenter}>
            <ActivityIndicator size="large" color={COLORS.red_13} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal lý do hủy đơn hàng */}
      <Modal isVisible={visibleReasonModal} backdropColor={COLORS.grey_9}>
        <ReasonModal />
      </Modal>
      {/* Modal thông báo không thể hủy đơn hàng */}
      <Modal isVisible={visibleNotification} backdropColor={COLORS.grey_9}>
        <NotificationModal />
      </Modal>
      {/* Header */}
      <Header />
      {/* Nội dung trang */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: COLORS.light,
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={40}
                color={COLORS.grey}
                style={{ textAlign: "center" }}
              />
              {/* Thời gian và trạng thái đơn */}
              <View
                style={{
                  ...styles.flexBox,
                  ...styles.borderBottom,
                  marginTop: -10,
                }}
              >
                <AntDesign name="clockcircleo" size={20} color={COLORS.dark} />
                <Text
                  style={{ marginLeft: 5, fontWeight: "bold", fontSize: 16 }}
                >
                  <Text>{formatShowDate(data.receivedTime)}</Text> -{"  "}
                  <Text>
                    Lấy đơn{"   "}
                    <Text style={{ color: COLORS.red_13 }}>Đã chấp nhận</Text>
                  </Text>
                </Text>
              </View>
              {/* Thông tin khách hàng */}
              <View style={styles.borderBottom}>
                <View
                  style={{
                    ...styles.flexBox,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ ...styles.flexBox, paddingHorizontal: 0 }}>
                    <AntDesign name="user" size={20} color={COLORS.dark} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginLeft: 5,
                        fontSize: 16,
                      }}
                    >
                      {data.customerName}
                    </Text>
                  </View>
                  <View style={styles.circleIcon}>
                    <MaterialIcons name="call" size={18} color={COLORS.light} />
                  </View>
                </View>
                <View style={{ ...styles.flexBox, marginTop: 8 }}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={20}
                    color={COLORS.dark}
                    style={{ paddingLeft: 3, marginRight: 8 }}
                  />
                  <Text style={{ flex: 1 }}>{data.customerAddress}</Text>
                </View>
              </View>
              {/* Thông tin cửa hàng */}
              <View style={styles.borderBottom}>
                <View
                  style={{
                    ...styles.flexBox,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ ...styles.flexBox, paddingHorizontal: 0 }}>
                    <Entypo name="shop" size={20} color={COLORS.dark} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginLeft: 5,
                        fontSize: 16,
                      }}
                    >
                      {data.shopName}
                    </Text>
                  </View>
                  <View style={styles.circleIcon}>
                    <MaterialIcons name="call" size={18} color={COLORS.light} />
                  </View>
                </View>
                <View style={{ ...styles.flexBox, marginTop: 8 }}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={20}
                    color={COLORS.dark}
                    style={{ paddingLeft: 3, marginRight: 8 }}
                  />
                  <Text style={{ flex: 1 }}>{data.shopAddress}</Text>
                </View>
              </View>
              {/* Chi tiết đơn hàng */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() => setIsCollapsed(!isCollapsed)}
                >
                  <Text style={styles.title}>CHI TIẾT ĐƠN HÀNG</Text>
                  <MaterialIcons
                    name={
                      isCollapsed
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.dark}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed}>
                  <View style={styles.table}>
                    {/* Bảng danh sách đơn hàng */}
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title style={{ flex: 1 }}>
                          STT
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }}>
                          MÃ
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 5 }}>
                          TÊN SẢN PHẨM
                        </DataTable.Title>
                        <DataTable.Title numeric style={{ flex: 1 }}>
                          SL
                        </DataTable.Title>
                      </DataTable.Header>
                      {/* gen ra danh sách sản phẩm */}
                      {listProduct.map((item, index) => (
                        <DataTable.Row key={index}>
                          <DataTable.Cell style={{ flex: 1 }}>
                            {+index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 2 }}>
                            {item.productCode}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 5 }}>
                            {item.productName}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={{ flex: 1 }}>
                            {item.productAmount}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </View>
                </Collapsible>
              </View>
              {/* Tiền phải trả lại cho quán */}
              <View>
                <View style={styles.titleItem}>
                  <Text style={styles.title}>TRẢ QUÁN</Text>
                </View>
                <View style={styles.borderBottom}>
                  <View style={styles.flexBox}>
                    <MaterialIcons
                      name="monetization-on"
                      size={20}
                      color={COLORS.dark}
                    />
                    <Text style={styles.money}>
                      {addDotToNumber(data.total)}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Tiền thu khách */}
              <View>
                <View style={styles.titleItem}>
                  <Text style={styles.title}>THU KHÁCH</Text>
                </View>
                <View style={styles.borderBottom}>
                  <View style={styles.flexBox}>
                    <MaterialIcons
                      name="monetization-on"
                      size={20}
                      color={COLORS.dark}
                    />
                    <Text style={styles.money}>
                      {addDotToNumber(+data.total + +data.shippingCost)}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Tiền được nhận */}
              <View>
                <View style={styles.titleItem}>
                  <Text style={styles.title}>ĐƯỢC NHẬN</Text>
                </View>
                <View style={styles.borderBottom}>
                  <View style={styles.flexBox}>
                    <MaterialIcons
                      name="monetization-on"
                      size={20}
                      color={COLORS.dark}
                    />
                    <Text style={styles.money}>
                      {addDotToNumber(data.shippingCost)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            style={{ ...styles.buttonSubmit }}
            activeOpacity={0.8}
            onPress={handlerSuccessOrder}
          >
            <Text
              style={{
                color: COLORS.light,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Thành công
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red_13,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconMenu: {
    padding: 10,
  },
  textDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.light,
  },
  footer: {
    justifyContent: "space-between",
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 15,
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  borderBottom: {
    borderBottomColor: COLORS.grey_3,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  circleIcon: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.green_5,
  },
  buttonSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: COLORS.green_5,
    borderRadius: 15,
    marginTop: 10,
  },
  detailOrder: {
    backgroundColor: COLORS.grey_3,
    marginBottom: 10,
  },
  titleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.grey_3,
    paddingHorizontal: 5,
    borderBottomColor: COLORS.grey_4,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingLeft: 5,
  },
  table: {
    padding: 5,
  },
  money: {
    fontSize: 16,
    marginLeft: 5,
  },

  // css cho modal
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
  iconClose: {
    zIndex: 1,
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 99,
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginLeft: 5,
    color: COLORS.light,
    fontWeight: "bold",
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

export default DetailMissonScreen;
