import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/color";
import StepIndicator from "react-native-step-indicator";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { addDotToNumber, formatDateTime } from "../utils/Common";
import { screenWidth } from "../utils/Dimentions";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import configData from "../config/config.json";

// style cho steps
const secondIndicatorStyles = {
  stepIndicatorSize: 38,
  currentStepIndicatorSize: 55,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: COLORS.red_13,
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: COLORS.red_13,
  stepStrokeUnFinishedColor: COLORS.grey_6,
  separatorFinishedColor: COLORS.red_13,
  separatorUnFinishedColor: COLORS.grey_6,
  stepIndicatorFinishedColor: COLORS.red_13,
  stepIndicatorUnFinishedColor: COLORS.light,
  stepIndicatorCurrentColor: COLORS.light,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: COLORS.red_13,
  stepIndicatorLabelFinishedColor: COLORS.light,
  stepIndicatorLabelUnFinishedColor: COLORS.grey_6,
  labelColor: COLORS.grey_7,
  labelSize: 14,
  currentStepLabelColor: COLORS.red_13,
};

// khai báo từng icon cho
const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: "feed",
    color: stepStatus === "finished" ? COLORS.light : COLORS.red_13,
    size: 20,
  };
  switch (position) {
    case 0: {
      iconConfig.name = "shopping-cart";
      break;
    }
    case 1: {
      iconConfig.name = "location-on";
      break;
    }
    case 2: {
      iconConfig.name = "assessment";
      break;
    }
    case 3: {
      iconConfig.name = "payment";
      break;
    }
    default: {
      break;
    }
  }
  return iconConfig;
};

const DetailMonitorScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [detailOrder, setDetailOrder] = useState({
    order: {
      total: 0,
      shopName: "",
      createDate: "",
      modifyDate: "",
    },
    products: [],
  });
  console.log(detailOrder.order);
  const [currentPosition, setCurrentPosition] = useState(0); //bước hiện tại
  const [notification, setNotification] = useState(""); // Nội dung thông báo
  const [visibleReasonModal, setVisibleReasonModal] = useState(false); //Ẩn hiện modal lý do hủy đơn hàng
  const [visibleNotification, setVisibleNotification] = useState(false); //Ẩn hiện modal thông báo

  // //cập nhật lại vị trí
  const onStepPress = (position) => {
    setCurrentPosition(position);
  };

  //Hàm gọi đến và custom icon bên trong từng step
  const renderStepIndicator = (params) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

  // Hàm xử lý khi chọn hủy đơn hàng
  const handleCancelOrder = async () => {
    setVisibleReasonModal(true);
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
          `${configData.SERVER_URL}cancel/orders`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              reason: reason,
              orderId: orderId,
            }),
          }
        );
        switch (response.status) {
          case 200:
            setCurrentPosition(3);
            setVisibleReasonModal(false);
            return;
          default:
            showToast("Hủy đơn hàng thất bại");
            return;
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
            width: '100%',
            justifyContent: "space-between",
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
            width: '100%',
            justifyContent: "space-between",
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

  // Component header
  const Header = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* Header */}
        <View>
          <TouchableOpacity
            onPress={() => navigation.popToTop()}
            style={styles.iconBack}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.red_13} />
          </TouchableOpacity>
          <View style={styles.title}>
            <Text style={styles.titleScreen}>Chi tiết đơn hàng</Text>
          </View>
        </View>
      </View>
    );
  };

  // Hàm gọi lên server để lấy chi tiết đơn hàng
  const loadDetailOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}orders/detail?orderId=${orderId}`,
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
          setDetailOrder({
            ...detailOrder,
            order: {
              total: resData.data[0].order.Total,
              shopName: resData.data[0].products[0].shopName,
              shopAvatar: resData.data[0].products[0].shopAvatar,
              createDate: formatDateTime(resData.data[0].order.CreateDate),
              modifyDate: formatDateTime(resData.data[0].order.ModifyDate),
            },
            products: resData.data[0].products,
          });
          if (+resData.data[0].order.Status >= 3) {
            setCurrentPosition(3);
          } else setCurrentPosition(resData.data[0].order.Status);
          setIsLoading(false);
          return;
        default:
          showToast("Lấy danh sách yêu thích thất bại");
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

  const CancelButton = () => {
    if (+currentPosition >= 2) {
      return <View></View>;
    }
    return (
      <TouchableOpacity
        style={styles.commandButton}
        onPress={handleCancelOrder}
      >
        <Text style={styles.panelButtonTitle}>Hủy đơn hàng</Text>
      </TouchableOpacity>
    );
  };

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        {/* Nội dung của trang */}
        <View
          style={{
            ...styles.content,
            backgroundColor: COLORS.light,
            alignItems: "center",
            flex: 1,
          }}
        >
          <View style={styles.containerCenter}>
            <ActivityIndicator size="large" color={COLORS.red_13} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Theo dõi các bước đặt hàng */}
        <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={4} //khai báo số bước
            customStyles={secondIndicatorStyles}
            currentPosition={currentPosition} //vị trí hiện tại
            // onPress={onStepPress}
            renderStepIndicator={renderStepIndicator} //custom lại icon bên trong step
            labels={[
              "Đang xử lý",
              "Đã xác nhận",
              "Đang giao hàng",
              "Hoàn thành",
            ]}
          />
        </View>
        <Text style={styles.titleChild}>Chi tiết hóa đơn</Text>
        {/* Hóa đơn */}
        <View style={styles.billContainer}>
          {/* header title */}
          <View
            style={{
              ...styles.flexContainer,
              borderBottomColor: COLORS.grey_3,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ ...styles.tableTitle, width: "8%" }}>STT</Text>
            <Text style={{ ...styles.tableTitle, width: "20%" }}>Mã SP</Text>
            <Text style={{ ...styles.tableTitle, width: "38%" }}>
              Tên sản phẩm
            </Text>
            <Text style={{ ...styles.tableTitle, width: "15%" }}>SL</Text>
            <Text style={{ ...styles.tableTitle, width: "20%" }}>Giá tiền</Text>
          </View>
          {/* Nội dung hóa đơn */}
          <ScrollView style={{ height: 150 }}>
            {detailOrder.products.map((item, index) => (
              <View
                style={{
                  ...styles.flexContainer,
                  borderBottomColor: COLORS.grey_3,
                  borderBottomWidth: 1,
                }}
                key={index}
              >
                <Text
                  style={{
                    width: "8%",
                    ...styles.propChild,
                  }}
                >
                  {index + 1}
                </Text>
                <Text style={{ width: "20%", ...styles.propChild }}>
                  {item.productCode}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ width: "35%", ...styles.propChild }}
                >
                  {item.productName}
                </Text>
                <Text style={{ width: "10%", ...styles.propChild }}>
                  {item.productAmount}
                </Text>
                <Text
                  style={{
                    width: "20%",
                    ...styles.propChild,
                    textAlign: "right",
                    paddingRight: 10,
                  }}
                >
                  {addDotToNumber(+item.productPrice * +item.productAmount)}
                </Text>
              </View>
            ))}
          </ScrollView>
          {/* Phí ship */}
          <View
            style={{
              ...styles.flexContainer,
              justifyContent: "space-between",
              ...styles.borderTop,
              paddingTop: 5,
            }}
          >
            <Text
              style={{
                ...styles.tableTitle,
                paddingLeft: 10,
                fontWeight: "100",
              }}
            >
              Phí ship
            </Text>
            <Text
              style={{
                color: COLORS.red_14,
                paddingHorizontal: 10,
              }}
            >
              {addDotToNumber(15000)}
            </Text>
          </View>
          {/* Tổng tiền */}
          <View
            style={{
              ...styles.flexContainer,
              justifyContent: "space-between",
              paddingTop: 5,
            }}
          >
            <Text
              style={{ ...styles.tableTitle, paddingLeft: 10, fontSize: 16 }}
            >
              Tổng tiền
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: COLORS.red_14,
                fontWeight: "bold",
                paddingHorizontal: 10,
              }}
            >
              {addDotToNumber(+detailOrder.order.total + 15000)}
            </Text>
          </View>
        </View>
        {/* Thông tin ngày tạo, ngày cập nhật trạng thái mới nhất của đơn hàng */}
        <View
          style={{
            ...styles.billContainer,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: detailOrder.order.shopAvatar,
            }}
            resizeMode="cover"
            style={styles.avatar}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, color: COLORS.dark }}
            >
              {detailOrder.order.shopName}
            </Text>
            <Text>Ngày tạo đơn: {detailOrder.order.createDate}</Text>
            <Text>Cập nhật lúc: {detailOrder.order.modifyDate}</Text>
          </View>
        </View>
        {/* Nút hủy đơn hàng */}
        <CancelButton />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    position: "relative",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBack: {
    position: "absolute",
    zIndex: 1,
    top: 15,
    left: 15,
  },
  title: {
    marginTop: 12,
  },
  titleScreen: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
  },
  stepIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  titleChild: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.red_14,
  },
  billContainer: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 15,
  },
  tableTitle: {
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.dark,
    fontSize: 14,
    paddingVertical: 5,
  },
  borderTop: {
    borderTopWidth: 2,
    borderTopColor: COLORS.grey_4,
  },
  propChild: {
    color: COLORS.grey_6,
    textAlign: "center",
    paddingVertical: 5,
  },
  titlePage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 10,
    textAlign: "center",
    width: screenWidth - 60,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 15,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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
  iconClose: {
    zIndex: 1,
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 99,
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

export default DetailMonitorScreen;
