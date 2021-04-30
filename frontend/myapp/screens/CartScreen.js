import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import COLORS from "../constants/color";
import { Checkbox } from "react-native-paper";
import { screenWidth } from "../utils/Dimentions";
import { useSelector, useDispatch } from "react-redux";
import ListCartProduct from "../components/ListCartProduct";
import { addDotToNumber, showToast } from "../utils/Common";
import * as cartActions from "../redux/actions/cart";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const CartScreen = () => {
  const listProduct = useSelector((state) => state.cartReducer.cart);
  const selectedList = useSelector(
    (state) => state.cartReducer.selectedProductInCart
  );
  const customer = useSelector((state) => state.authReducer.customer);
  const ship = useSelector((state) => state.cartReducer.ship);
  const totalPayment = useSelector((state) => state.cartReducer.totalPayment);
  const [isLoading, setIsLoading] = useState(false); //biến check đang tải dữ liệu
  const [checkedAll, setCheckedAll] = useState(false);
  const dispatch = useDispatch();

  // Gen header của trang
  const Header = () => {
    return (
      <View style={style.header}>
        <View>
          <Image
            source={require("../assets/logo/logo3.png")}
            resizeMode="contain"
            style={{ height: 50, width: 115 }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={style.title}>Tất cả</Text>
          <View style={{ paddingTop: 15, marginLeft: 5 }}>
            <Checkbox
              status={checkedAll ? "checked" : "unchecked"}
              onPress={() => {
                setCheckedAll(!checkedAll);
              }}
              color={COLORS.red_13}
            />
          </View>
        </View>
      </View>
    );
  };

  // Hàm gen hiển thị danh sách sản phẩm trong giỏ hàng
  const CartBody = () => {
    return (
      <View>
        {listProduct.map((listProdForShop, index) => (
          <ListCartProduct
            key={index}
            shopName={listProdForShop[0].shopName}
            data={listProdForShop}
            checkedAll={checkedAll}
          />
        ))}
      </View>
    );
  };

  // Hàm thực hiện xóa sản phẩm khỏi cửa hàng
  const removeProductInCart = async (listProd, token) => {
    const response = await fetch("http://192.168.0.4:3000/api/carts", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        listProd: listProd,
      }),
    });

    return response.status;
  };

  // Hàm xử lý sự kiện xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProdInCart = async () => {
    if (selectedList.length > 0) {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          let listProd = [];
          selectedList.forEach((id) => {
            listProduct.forEach((item) => {
              const prod = item.find((i) => i.productId === id);
              if (prod) {
                listProd.push({
                  productId: prod.productId,
                  cartId: prod.cartId,
                });
              }
            });
          });
          const status = await removeProductInCart(listProd, token);
          if (status == 200) {
            dispatch(cartActions.removeAllSelected());
            dispatch(cartActions.getOldCart(customer.customerId, token));
            showToast(`Cập nhật sản phẩm trong giỏ thành công!`);
          } else {
            showToast(`Cập nhật sản phẩm trong giỏ thất bại!`);
          }
        } else {
          Alert.alert("goFAST", `Lỗi lấy xác thực`, [
            {
              text: "Thực hiện lại",
              onPress: () => addProductToCart(),
            },
            {
              text: "Hủy",
              style: "cancel",
            },
          ]);
        }
      } catch (err) {
        Alert.alert("goFAST", `Lỗi cập nhật sản phẩm trong giỏ hàng: ${err}`, [
          {
            text: "Thực hiện lại",
            onPress: () => addProductToCart(),
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]);
      }
    } else {
      showToast(`Bạn chưa chọn sản phẩm cần xóa! Vui lòng chọn 1 sản phẩm.`);
    }
  };

  // Hàm thực hiện đặt hàng danh sách
  const orderProducts = async (listProd, token) => {
    //Từ mảng sản phẩm chuyển về mảng đã phân loại theo từng shop => tương ứng với từng order
    const listDupShop = listProd.map((i) => i.shopId);
    const listShop = listDupShop.filter(
      (val, index) => listDupShop.indexOf(val) === index
    );
    let listProductForShop = [];
    listShop.forEach((shopId) => {
      const listProdInShop = listProd.filter((item) => item.shopId === shopId);
      listProductForShop.push(listProdInShop);
    });
    // Thực hiện gửi request lên server
    const response = await fetch("http://192.168.0.4:3000/api/orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        listProductForShop: listProductForShop,
        customerId: customer.customerId
      }),
    });

    return response.status;
  };

  // Hàm xử lý đặt hàng
  const handleOrderProduct = async () => {
    if (selectedList.length > 0) {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          let listProd = [];
          selectedList.forEach((id) => {
            listProduct.forEach((item) => {
              const prod = item.find((i) => i.productId === id);
              if (prod) {
                listProd.push({
                  productId: prod.productId,
                  cartId: prod.cartId,
                  productAmount: prod.productAmount,
                  productPrice: prod.productPrice,
                  shopId: prod.shopId
                });
              }
            });
          });
          let status = 200;
          const statusOrder = await orderProducts(listProd, token);
          console.log(statusOrder);
          const statusRemove = await removeProductInCart(listProd, token);
          if(statusOrder != 200 || statusRemove != 200 ){
            status = 500;
          }
          if (status == 200) {
            dispatch(cartActions.getOldCart(customer.customerId, token));
            dispatch(cartActions.removeAllSelected());
            showToast(`Đặt hàng thành công. Vui lòng vào Tài khoản => Theo dõi đơn hàng để theo dõi tiến độ đơn hàng.`);
          } else {
            showToast(`Có lỗi xảy ra khi đặt hàng!`);
          }
        } else {
          Alert.alert("goFAST", `Lỗi lấy xác thực`, [
            {
              text: "Thực hiện lại",
              onPress: () => addProductToCart(),
            },
            {
              text: "Hủy",
              style: "cancel",
            },
          ]);
        }
      } catch (err) {
        Alert.alert("goFAST", `Lỗi cập nhật sản phẩm trong giỏ hàng: ${err}`, [
          {
            text: "Thực hiện lại",
            onPress: () => addProductToCart(),
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]);
      }
    } else {
      showToast(`Bạn chưa chọn sản phẩm cần mua! Vui lòng chọn 1 sản phẩm.`);
    }
  };

  // Check trường hợp đang tải dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView style={style.container}>
        <Header />
        <View style={style.containerCenter}>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </View>
      </SafeAreaView>
    );
  }

  // Check trong trường hợp giỏ hàng trống
  if (listProduct.length <= 0) {
    return (
      <View style={{ backgroundColor: COLORS.light, flex: 1 }}>
        {/* Logo */}
        <View style={style.header}>
          <Image
            source={require("../assets/logo/logo3.png")}
            resizeMode="contain"
            style={{ height: 50, width: 115 }}
          />
        </View>
        {/* Nội dung */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../assets/shopping-bag.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          <Text style={style.titlePage}>Giỏ hàng trống!</Text>
          <Text
            style={{
              fontSize: 16,
              width: screenWidth - 100,
              textAlign: "center",
            }}
          >
            Còn chờ gì nữa, shopping cùng goFAST ngay nào.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CartBody />
        <View style={{ paddingHorizontal: 20 }}>
          {/* Tiền ship */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>Phí vận chuyển</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.red_14,
              }}
            >
              {+ship > 0 ? `${+ship / 15000} x 15,000` : 0}
            </Text>
          </View>
          {/* Tổng tiền thanh toán */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tổng tiền</Text>
            <Text
              style={{
                fontSize: 21,
                fontWeight: "bold",
                color: COLORS.red_14,
              }}
            >
              {addDotToNumber(totalPayment)}
            </Text>
          </View>
          {/* Nút đặt mua */}
          <TouchableOpacity
            style={{
              ...style.commandButton,
              backgroundColor: COLORS.grey_6,
            }}
            onPress={handleRemoveProdInCart}
          >
            <Text style={style.panelButtonTitle}>Xóa khỏi giỏ hàng</Text>
          </TouchableOpacity>
          {/* Nút đặt mua */}
          <TouchableOpacity
            style={style.commandButton}
            onPress={handleOrderProduct}
          >
            <Text style={style.panelButtonTitle}>Đặt mua</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  title: {
    color: COLORS.grey_7,
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 15,
  },
  commandButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.red_13,
    alignItems: "center",
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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

export default CartScreen;
