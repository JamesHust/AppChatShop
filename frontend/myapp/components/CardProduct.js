import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/Dimentions";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addDotToNumber, showToast } from "../utils/Common";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import * as cartActions from "../redux/actions/cart";

const CartProduct = (props) => {
  const [product, setProduct] = useState(props.data.item);
  const [amount, setAmount] = useState(0);
  const [amountHandle, setAmountHandle] = useState(0);
  const navigation = useNavigation(); //Cho phép truy cập navigation
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.authReducer.customer);
  const cart = useSelector((state) => state.cartReducer.cart);
  
  // Hàm lấy sản phẩm đã mua trong giỏ
  const getAmountExistCart = () => {
    // Lấy lại danh sách sản phẩm đã có trong giỏ
    if (cart.length > 0) {
      const list = [];
      cart.forEach((element) => {
        element.forEach((prod) => {
          list.push(prod);
        });
      });
      const existProd = list.find((i) => i.productId === product.productId);
      if (existProd) {
        return existProd.productAmount;
      } else return 0;
    } else return 0;
  };

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (amount > 0) {
      setAmount((amount) => amount - 1);
    } else {
      setAmount(0);
    }
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    const exist = getAmountExistCart();
    // Check xem số lượng có vượt quá giỏ hàng không
    const check = (+exist + amount + 1) - (+product.amount);
    if (check <= 0) {
      setAmount((amount) => amount + 1);
    } else {
      showToast("Số lượng chọn vượt quá số lượng trong kho");
    }
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const addProductToCart = useCallback(async (amountBuy) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch("http://192.168.1.125:3000/api/carts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            customerId: customer.customerId,
            shopId: product.shopId,
            productId: product.productId,
            productPrice: product.purchasePrice,
            productAmount: amountBuy,
          }),
        });
        switch (response.status) {
          case 200:
            dispatch(cartActions.getOldCart(customer.customerId, token));
            showToast(`Thêm thành công ${amountBuy} sản phẩm mới vào giỏ!`);
            return;
          default:
            showToast(`Thêm mới sản phẩm vào giỏ thất bại!`);
            return;
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
      Alert.alert("goFAST", `Lỗi thêm sản phẩm vào giỏ hàng: ${err}`, [
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
  }, []);

  // Theo dõi khi số lượng thay đổi sau 1.8 giây sẽ thêm sản phẩm vào giỏ
  useEffect(() => {
    if (amountHandle > 0) {
      addProductToCart(amountHandle);
    }
  }, [amountHandle]);

  // Theo dõi số lượng sản phẩm mua thay đổi sau 1.8 giây
  useEffect(() => {
    const prodAmountAdd = setTimeout(() => {
      const exist = getAmountExistCart();
      // Check xem số lượng có vượt quá giỏ hàng không
      const check = +exist + amount - (+product.amount);
      let rest = (+product.amount) - (+exist);
      if(rest <= 0) rest = 0;
      if(check <= 0){
        setAmountHandle(amount);
      }else{
        showToast(`Số lượng chọn vượt quá số lượng trong kho. Số lượng còn lại là ${rest}.`);
      }
    }, 1800);
    return () => clearTimeout(prodAmountAdd);
  }, [amount]);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={() =>
        navigation.navigate("DetailProduct", { idProduct: product.productId })
      }
    >
      <View>
        {/* Ảnh minh họa sản phẩm */}
        <View>
          <Image
            source={{ uri: product.imageUrl }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        {/* Thông tin cơ bản sản phẩm */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={styles.containerInfoProduct}>
            {/* Tên sản phẩm */}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.nameProduct}
            >
              {product.productName}
            </Text>
            {/* Giá bán sản phẩm */}
            <Text style={styles.textPrice}>
              {addDotToNumber(product.purchasePrice)} ₫
            </Text>
            {/* Đánh giá, số lượng đã bán */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <AntDesign name="star" size={13} color={COLORS.amber} />
              {/* Đánh giá */}
              <Text
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 2,
                  color: COLORS.dark,
                }}
              >
                {product.rating}
              </Text>
              {/* Số lượng đã bán */}
              <Text style={{ fontWeight: "bold", color: COLORS.grey_6 }}>
                ({product.quantitySold})
              </Text>
            </View>
          </View>
          {/* Thêm số lượng sản phẩm > 0 vào giỏ hàng*/}
          <View style={styles.containerSetAmount}>
            <View style={styles.buttonSetAmount}>
              <Text style={styles.iconSetAmount} onPress={increasingAmount}>
                +
              </Text>
            </View>
            <View
              style={{
                ...styles.buttonSetAmount,
                backgroundColor: COLORS.red_13,
              }}
            >
              <Text style={styles.iconSetAmount}>{amount}</Text>
            </View>
            <View style={styles.buttonSetAmount}>
              <Text style={styles.iconSetAmount} onPress={reduceAmount}>
                -
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    width: screenWidth / 2,
    backgroundColor: COLORS.light,
    borderRadius: 15,
    borderColor: COLORS.grey_4,
    borderWidth: 1,
    overflow: "hidden",
    padding: 10,
  },
  image: {
    width: screenWidth / 2 - 30,
    height: 175,
  },
  containerInfoProduct: {
    width: "75%",
  },
  nameProduct: {
    fontSize: 15,
    color: COLORS.dark,
    width: "95%",
  },
  textPrice: {
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 5,
    color: COLORS.red_14,
  },
  containerSetAmount: {
    width: "22%",
    height: 90,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonSetAmount: {
    height: 30,
    backgroundColor: COLORS.red_14,
    justifyContent: "center",
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
});

export default CartProduct;
