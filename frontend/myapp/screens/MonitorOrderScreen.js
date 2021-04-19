import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/color";
import StepIndicator from "react-native-step-indicator";
import { MaterialIcons } from "@expo/vector-icons";
import foods from "../data/foods";
import { addDotToNumber } from "../utils/Common";
import { screenWidth } from "../utils/Dimentions";

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

const MonitorOrderScreen = ({ navigation }) => {
  const [listProduct, setListProduct] = useState(foods);
  const [currentPosition, setCurrentPosition] = useState(0); //vị trí

  // //cập nhật lại vị trí
  const onStepPress = (position) => {
    setCurrentPosition(position);
  };

  // hàm tính tổng hóa đơn
  const totalBill = (listProduct) => {
    let sum = 0;
    listProduct.map((item) => {
      sum += parseInt(item.price);
    });
    return sum;
  };

  //Hàm gọi đến và custom icon bên trong từng step
  const renderStepIndicator = (params) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

  // Xét trường hợp không có đơn hàng nào đang thực hiện
  // useEffect(() => {
  if (!listProduct || listProduct.length <= 0) {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          {/* Quay về trang đầu */}
          <View style={styles.flexContainer}>
            <Icon
              name="arrow-back"
              size={28}
              color={COLORS.red_13}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Theo dõi đơn hàng</Text>
          </View>
        </View>
        {/* Danh sách sản phẩm yêu thích trống */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Nội dung */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../assets/box-empty.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={styles.titlePage}>Hiện không có đơn hàng nào!</Text>
            <Text
              style={{
                fontSize: 16,
                width: screenWidth - 100,
                textAlign: "center",
              }}
            >
              Cùng goFAST trải nghiệm và tiến hành đặt hàng ngay.
            </Text>
          </View>
        </View>
      </View>
    );
  }
  // }, [listProduct]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        {/* Quay về trang đầu */}
        <View style={styles.flexContainer}>
          <Icon
            name="arrow-back"
            size={28}
            color={COLORS.red_13}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Theo dõi đơn hàng</Text>
        </View>
      </View>
      {/* Theo dõi các bước đặt hàng */}
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={4} //khai báo số bước
          customStyles={secondIndicatorStyles}
          currentPosition={currentPosition} //vị trí hiện tại
          onPress={onStepPress}
          renderStepIndicator={renderStepIndicator} //custom lại icon bên trong step
          labels={["Đang xử lý", "Đóng gói hàng", "Giao hàng", "Đã nhận hàng"]}
        />
      </View>
      <Text style={styles.titleChild}>Chi tiết hóa đơn</Text>
      {/* Hóa đơn */}
      <View style={styles.billContainer}>
        {/* header title */}
        <View style={styles.flexContainer}>
          <Text style={{ ...styles.tableTitle, width: "15%" }}>STT</Text>
          <Text style={{ ...styles.tableTitle, width: "42%" }}>
            Tên sản phẩm
          </Text>
          <Text style={{ ...styles.tableTitle, width: "20%" }}>Số lượng</Text>
          <Text style={{ ...styles.tableTitle, width: "20%" }}>Giá tiền</Text>
        </View>
        {/* Nội dung hóa đơn */}
        <ScrollView style={{ height: 180 }}>
          {listProduct.map((item, index) => (
            <View style={styles.flexContainer}>
              <Text
                style={{
                  width: "15%",
                  ...styles.propChild,
                }}
              >
                {index + 1}
              </Text>
              <Text style={{ width: "42%", ...styles.propChild }}>
                {item.name}
              </Text>
              <Text style={{ width: "20%", ...styles.propChild }}>
                {item.buy}
              </Text>
              <Text
                style={{
                  width: "20%",
                  ...styles.propChild,
                  textAlign: "right",
                  paddingRight: 10,
                }}
              >
                {addDotToNumber(parseInt(item.price) * item.buy)}
              </Text>
            </View>
          ))}
        </ScrollView>
        {/* Tổng tiền */}
        <View
          style={{
            ...styles.flexContainer,
            justifyContent: "space-between",
            ...styles.borderTop,
            paddingTop: 5,
          }}
        >
          <Text style={{ ...styles.tableTitle, paddingLeft: 10, fontSize: 16 }}>
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
            {addDotToNumber(totalBill(listProduct))}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/box.png")}
          resizeMode="contain"
          style={{ height: 70, width: 70 }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            width: 300,
            color: COLORS.grey_13,
          }}
        >
          Hàng sẽ được giao sau ít phút nữa. Chuẩn bị nhận hàng ngay nào!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
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
});

export default MonitorOrderScreen;
