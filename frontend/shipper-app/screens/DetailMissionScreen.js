import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import products from "../data/detail_order";
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";

const DetailMissonScreen = (props) => {
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const [statusDeliver, setStatusDeliver] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
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
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={styles.textDate}>BKSHOP_OR00001</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
                  <Text>05:17 PM</Text> -{"  "}
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
                      Hưng
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
                  <Text style={{ flex: 1 }}>
                    22 ngách 20 Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội
                  </Text>
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
                      BKShop
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
                  <Text style={{ flex: 1 }}>
                    22 ngách 20 Ngõ Trại Cá, Trương Định, Hai Bà Trưng, Hà Nội
                  </Text>
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
                        <DataTable.Title style={{flex: 1}}>
                          STT
                        </DataTable.Title>
                        <DataTable.Title  style={{flex: 2}}>MÃ</DataTable.Title>
                        <DataTable.Title  style={{flex: 5}}>TÊN SẢN PHẨM</DataTable.Title>
                        <DataTable.Title numeric style={{flex: 1}}>SL</DataTable.Title>
                      </DataTable.Header>
                      {/* gen ra danh sách sản phẩm */}
                      {products.map((item, index) => (
                        <DataTable.Row key={index}>
                          <DataTable.Cell style={{flex: 1}}>
                            {+index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell  style={{flex: 2}}>
                            {item.productCode}
                          </DataTable.Cell>
                          <DataTable.Cell  style={{flex: 5}}>
                            {item.productName}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={{flex: 1}}>
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
                    <Text style={styles.money}>100,000</Text>
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
                    <Text style={styles.money}>115,000</Text>
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
                    <Text style={styles.money}>15,000</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View>
          {+statusDeliver > 0 ? (
            <TouchableOpacity
              style={{ ...styles.buttonSubmit }}
              activeOpacity={0.8}
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
          ) : (
            <TouchableOpacity
              style={{ ...styles.buttonSubmit }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: COLORS.light,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Giao hàng
              </Text>
            </TouchableOpacity>
          )}
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
    marginTop: 10
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
  money:{
    fontSize: 16,
    marginLeft: 5
  }
});

export default DetailMissonScreen;
