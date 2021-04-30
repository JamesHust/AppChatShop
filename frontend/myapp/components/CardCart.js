import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Checkbox } from "react-native-paper";
import COLORS from "../constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { addDotToNumber, showToast } from "../utils/Common";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../redux/actions/cart";

const CardCart = ({ data, checkedAll }) => {
  const customer = useSelector((state) => state.authReducer.customer);
  const selectedList = useSelector(
    (state) => state.cartReducer.selectedProductInCart
  );
  const [checked, setChecked] = useState(false);
  const [amount, setAmount] = useState(`${data.productAmount}`);
  const [amountHandle, setAmountHandle] = useState();
  const isFirstRun = useRef(true);
  const dispatch = useDispatch(); //khởi tạo dispatch

  // Check tất cả các thẻ trong trường hợp chọn tất cả
  useEffect(() => {
    setChecked(checkedAll);
  }, [checkedAll]);

  // Hàm xét check khi danh sách check có
  useEffect(() => {
    selectedList.findIndex((i) => i == data.productId) >= 0
      ? setChecked(true)
      : setChecked(false);
  }, []);

  // hàm xử lý khi check và không check sản phẩm
  const handleCheck = () => {
    if (!checked) {
      dispatch(cartActions.addSelectedProductCart(data.productId));
    } else {
      dispatch(cartActions.removeSelectedProductCart(data.productId));
    }
    setChecked(!checked);
  };

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (+amount > 1) {
      setAmount((amount) => `${+amount - 1}`);
    } else setAmount("1");
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    setAmount((amount) => `${+amount + 1}`);
  };

  // Hàm xử lý khi tự nhập sản phẩm
  const numberInputHandler = (inputText) => {
    if (inputText && inputText!="0") {
      setAmount(inputText.replace(/[^0-9]/g, ""));
    } else setAmount("1");
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const updateProductToCart = useCallback(
    async (amountBuy) => {
      console.log("updateProductToCart");
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const response = await fetch("http://192.168.0.4:3000/api/carts", {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              productId: data.productId,
              cartId: data.cartId,
              amountUpdate: amountBuy,
            }),
          });
          switch (response.status) {
            case 200:
              dispatch(cartActions.getOldCart(customer.customerId, token));
              showToast(`Cập nhật sản phẩm trong giỏ thành công!`);
              return;
            default:
              showToast(`Cập nhật sản phẩm trong giỏ thất bại!`);
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
    },
    [amountHandle]
  );

  // Theo dõi khi số lượng thay đổi sau 1.8 giây sẽ thêm sản phẩm vào giỏ
  useEffect(() => {
    if (amountHandle >= 0) {
      updateProductToCart(amountHandle);
    }
  }, [amountHandle]);

  // Theo dõi số lượng sản phẩm mua thay đổi sau 1.8 giây
  useEffect(() => {
    if (!isFirstRun.current) {
      const prodAmountUpdate = setTimeout(() => {
        setAmountHandle(+amount);
      }, 1500);
      return () => clearTimeout(prodAmountUpdate);
    } else {
      isFirstRun.current = false;
    }
  }, [amount]);

  return (
    <View style={style.cardCart}>
      {/* Chọn xem có đặt mua không */}
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={handleCheck}
        color={COLORS.red_13}
      />
      {/* Ảnh minh họa cho sản phẩm */}
      <Image
        source={{ uri: data.imageUrl }}
        style={{ height: 90, width: 90 }}
      />
      {/* Thông tin sản phẩm */}
      <View style={style.infoProductContainer}>
        {/* Tên sản phẩm */}
        <Text style={style.nameProduct} numberOfLines={1} ellipsizeMode="tail">
          {data.productName}
        </Text>
        {/* Loại sản phẩm */}
        <Text style={{ fontSize: 13, color: COLORS.grey }}>
          {data.categoryName}
        </Text>
        {/* Giá sản phẩm */}
        <Text style={style.price}>{addDotToNumber(data.productPrice)} ₫</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
          <View style={{ width: 50 }}>
            <TextInput
              blurOnSubmit
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={4}
              style={style.input}
              value={amount}
              onChangeText={numberInputHandler}
            />
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
    </View>
  );
};

const style = StyleSheet.create({
  cardCart: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    marginVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
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
    width: 100,
    color: COLORS.dark,
  },
  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.red_13,
  },
  infoProductContainer: {
    height: 100,
    marginLeft: 5,
    paddingVertical: 18,
    flex: 1,
    justifyContent: "space-between",
  },
  containerSetAmount: {
    flexDirection: "row",
    overflow: "hidden",
    alignItems: 'center',
    justifyContent: 'center'
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
  input: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default CardCart;
