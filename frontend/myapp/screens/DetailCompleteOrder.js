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
  Button,
} from "react-native";
import COLORS from "../constants/color";
import StepIndicator from "react-native-step-indicator";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { addDotToNumber, formatShowDate } from "../utils/Common";
import { screenWidth } from "../utils/Dimentions";
import Modal from "react-native-modal";
import { showToast } from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

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

const DetailCompleteScreen = ({ route, navigation }) => {
  const { orderId, lastStep } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [detailOrder, setDetailOrder] = useState({
    order: {
      total: 0,
      shopName: "",
      createDate: "",
      modifyDate: "",
    },
    products: [],
    reason: null,
  });
  const [currentPosition, setCurrentPosition] = useState(0); //bước hiện tại
  const [notification, setNotification] = useState(""); // Nội dung thông báo
  const [visibleNotification, setVisibleNotification] = useState(false); //Ẩn hiện modal thông báo

  // //cập nhật lại vị trí
  const onStepPress = (position) => {
    setCurrentPosition(position);
  };

  //Hàm gọi đến và custom icon bên trong từng step
  const renderStepIndicator = (params) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

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
        `http://192.168.1.125:3000/api/orders/detail?orderId=${orderId}`,
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
          if (resData.data[0].reason) {
            setDetailOrder({
              ...detailOrder,
              order: {
                total: resData.data[0].order.Total,
                shopName: resData.data[0].products[0].shopName,
                shopAvatar: resData.data[0].products[0].shopAvatar,
                createDate: formatShowDate(resData.data[0].order.CreateDate),
                modifyDate: formatShowDate(resData.data[0].order.ModifyDate),
              },
              products: resData.data[0].products,
              reason: resData.data[0].reason.Reason,
            });
          } else {
            setDetailOrder({
              ...detailOrder,
              order: {
                total: resData.data[0].order.Total,
                shopName: resData.data[0].products[0].shopName,
                shopAvatar: resData.data[0].products[0].shopAvatar,
                createDate: formatShowDate(resData.data[0].order.CreateDate),
                modifyDate: formatShowDate(resData.data[0].order.ModifyDate),
              },
              products: resData.data[0].products,
            });
          }
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
            labels={["Đang xử lý", "Đã xác nhận", "Đang giao hàng", lastStep]}
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
            <Text style={{ ...styles.tableTitle, width: "18%" }}>Mã SP</Text>
            <Text style={{ ...styles.tableTitle, width: "45%" }}>
              Tên sản phẩm
            </Text>
            <Text style={{ ...styles.tableTitle, width: "8%" }}>SL</Text>
            <Text style={{ ...styles.tableTitle, width: "25%" }}>Chi tiết</Text>
          </View>
          {/* Nội dung hóa đơn */}
          <ScrollView style={{ height: 130 }}>
            {detailOrder.products.map((item, index) => (
              <View
                style={{
                  ...styles.flexContainer,
                  borderBottomColor: COLORS.grey_3,
                  borderBottomWidth: 1,
                }}
                key={index}
              >
                <Text style={{ width: "18%", ...styles.propChild }}>
                  {item.productCode}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ width: "45%", ...styles.propChild }}
                >
                  {item.productName}
                </Text>
                <Text style={{ width: "8%", ...styles.propChild }}>
                  {item.productAmount}
                </Text>
                <View
                  style={{
                    width: "25%",
                    ...styles.propChild,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate("DetailProduct", { idProduct: item.productId })}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: COLORS.red_13,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: COLORS.light }}>Chi tiết</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
          }}
        >
          <View
            style={{
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
          {detailOrder.reason ? (
            <View
              style={{
                marginTop: 10,
                borderTopWidth: 1,
                borderTopColor: COLORS.grey_4,
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: COLORS.dark,
                  marginBottom: 5,
                }}
              >
                Lý do hủy:
              </Text>
              <TextInput
                multiline={true}
                value={detailOrder.reason}
                style={{
                  backgroundColor: COLORS.grey_3,
                  textAlignVertical: "top",
                  borderRadius: 15,
                  padding: 10,
                }}
                numberOfLines={4}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
          ) : (
            <View></View>
          )}
        </View>
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

export default DetailCompleteScreen;
