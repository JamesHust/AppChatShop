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
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import debt from "../data/debt";
import history from "../data/history";

const DebtScreen = (props) => {
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const [isCollapseHistory, setIsCollapseHistory] = useState(true);
  const [isCollapseDebt, setIsCollapseDebt] = useState(true);
  // Component header
  const Header = () => {
    return (
      <View style={styles.containerHeader}>
        {/* Toggle Menu */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons
            name="menu"
            size={30}
            color={COLORS.light}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        {/* Ngày tháng hiện tại */}
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={styles.textDate}>Công nợ & Lịch sử</Text>
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
              {/* Công nợ */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() => setIsCollapseDebt(!isCollapseDebt)}
                >
                  <Text style={styles.title}>DANH SÁCH CÔNG NỢ</Text>
                  <MaterialIcons
                    name={
                      isCollapseDebt
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.dark}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapseDebt}>
                  <View style={styles.table}>
                    {/* Bảng danh sách công nợ */}
                    {debt ? (
                      <DataTable>
                        <DataTable.Header>
                          <DataTable.Title style={{ flex: 1 }}>
                            STT
                          </DataTable.Title>
                          <DataTable.Title style={{ flex: 2 }}>
                            CỬA HÀNG
                          </DataTable.Title>
                          <DataTable.Title style={{ flex: 1 }}>
                            TRẢ QUÁN
                          </DataTable.Title>
                        </DataTable.Header>
                        {/* gen ra danh sách sản phẩm */}
                        {debt.map((item, index) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell style={{ flex: 1 }}>
                              {+index + 1}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ flex: 2 }}>
                              {item.shopName}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ flex: 1 }}>
                              {item.payment}
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      </DataTable>
                    ) : (
                      <Text style={{ textAlign: "center" }}>
                        Hiện không còn nợ
                      </Text>
                    )}
                  </View>
                </Collapsible>
              </View>
              {/* Lịch sử giao hàng trong ngày */}
              <View style={styles.detailOrder}>
                <TouchableOpacity
                  style={styles.titleItem}
                  activeOpacity={0.6}
                  onPress={() => setIsCollapseHistory(!isCollapseHistory)}
                >
                  <Text style={styles.title}>LỊCH SỬ GIAO HÀNG</Text>
                  <MaterialIcons
                    name={
                      isCollapseHistory
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={COLORS.dark}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={isCollapseHistory}>
                  <View style={styles.table}>
                    {/* Bảng danh sách đơn hàng */}
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title style={{ flex: 1 }}>
                          STT
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 5 }}>
                          MÃ ĐƠN GIAO
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }}>
                          TRẢ QUÁN
                        </DataTable.Title>
                        <DataTable.Title numeric style={{ flex: 2 }}>
                          NHẬN
                        </DataTable.Title>
                      </DataTable.Header>
                      {/* gen ra danh sách sản phẩm */}
                      {history.map((item, index) => (
                        <DataTable.Row key={index}>
                          <DataTable.Cell style={{ flex: 1 }}>
                            {+index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 5 }}>
                            {item.orderShipCode}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 2 }}>
                            {item.payment}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={{ flex: 2 }}>
                            15,000
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </View>
                </Collapsible>
              </View>
            </View>
          </View>
        </ScrollView>
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
    fontSize: 20,
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
});

export default DebtScreen;
