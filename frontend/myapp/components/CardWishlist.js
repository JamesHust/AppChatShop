import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import COLORS from "../constants/color";
import { addDotToNumber, showToast } from "../utils/Common";
import { MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import * as wishlistActions from "../redux/actions/wishlist";
import * as cartActions from "../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const CartWishList = (props) => {
  const [amount, setAmount] = useState(0);
  const [product, setProduct] = useState(props.data);
  const [amountHandle, setAmountHandle] = useState(0);
  const customer = useSelector((state) => state.authReducer.customer);
  // const navigation = useNavigation(); //Cho phép truy cập navigation
  const dispatch = useDispatch();

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (amount > 0) {
      setAmount((amount) => amount - 1);
    } else setAmount(0);
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    setAmount((amount) => amount + 1);
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
            console.log("200");
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
      setAmountHandle(amount);
    }, 1800);
    return () => clearTimeout(prodAmountAdd);
  }, [amount]);

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={style.cardWishlist}>
        <View style={style.flexContainer}>
          {/* Ảnh minh họa cho sản phẩm */}
          <Image
            source={{ uri: product.imageUrl }}
            style={{ height: 100, width: 100 }}
          />
          {/* Thông tin sản phẩm */}
          <View style={style.infoProductContainer}>
            {/* Tên sản phẩm */}
            <Text
              style={style.nameProduct}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {product.productName}
            </Text>
            {/* Loại sản phẩm, Đánh giá */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              {/* Tên loại sản phẩm */}
              <Text style={{ color: COLORS.dark }}>{product.categoryName}</Text>
              {/* Đánh giá */}
              <Entypo
                name="dot-single"
                size={18}
                color={COLORS.grey_6}
                style={{ marginTop: 2 }}
              />
              <AntDesign name="star" size={13} color={COLORS.amber} />
              <Text style={style.ratingText}>{product.rating}</Text>
              {/* Số lượng đã mua */}
              <Text style={{ fontWeight: "bold", color: COLORS.grey_6 }}>
                ({product.quantitySold})
              </Text>
            </View>
            {/* Giá sản phẩm */}
            <Text style={style.price}>
              {addDotToNumber(product.purchasePrice)} ₫
            </Text>
          </View>
        </View>
        <View
          style={{
            ...style.flexContainer,
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <View style={style.actionContainer}>
            <View style={style.containerSetAmount}>
              <TouchableOpacity onPress={reduceAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...style.buttonSetAmount,
                    backgroundColor: COLORS.grey_5,
                  }}
                >
                  <Text style={style.iconSetAmount}>-</Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...style.buttonSetAmount,
                }}
              >
                <Text style={{ ...style.iconSetAmount, color: COLORS.dark }}>
                  {amount}
                </Text>
              </View>
              <TouchableOpacity onPress={increasingAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...style.buttonSetAmount,
                    backgroundColor: COLORS.red_13,
                  }}
                >
                  <Text style={style.iconSetAmount}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Button xóa sản phâm khỏi danh sách yêu thích */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.remove(product.productId)}
          >
            <View style={style.flexContainer}>
              <MaterialIcons name="delete" size={24} color={COLORS.grey_6} />
              <Text style={{ fontSize: 16, color: COLORS.grey_6 }}>Xóa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  cardWishlist: {
    height: 140,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 5,
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  nameProduct: {
    fontWeight: "bold",
    fontSize: 16,
    width: 225,
    color: COLORS.dark,
  },
  price: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.red_13,
  },
  infoProductContainer: {
    height: 100,
    marginLeft: 10,
    paddingVertical: 18,
    flex: 1,
    justifyContent: "space-between",
  },
  containerSetAmount: {
    flexDirection: "row",
    overflow: "hidden",
  },
  buttonSetAmount: {
    width: 30,
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingText: {
    fontWeight: "bold",
    marginHorizontal: 2,
    color: COLORS.dark,
  },
});

export default CartWishList;
