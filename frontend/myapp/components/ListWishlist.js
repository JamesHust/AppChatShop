import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import CardWishlist from "./CardWishlist";
import COLORS from "../constants/color";
import { showToast } from "../utils/Common";
import * as wishlistActions from "../redux/actions/wishlist";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import configData from "../config/config.json";

const ListWishList = (props) => {
  const customer = useSelector((state) => state.authReducer.customer);
  const dispatch = useDispatch();
  // Hàm xử lý xóa sản phẩm khỏi danh sách yêu thích
  const handleRemoveFavouriteProd = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${configData.SERVER_URL}reviews/products`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            idCustomer: customer.customerId,
            idProduct: productId,
            isFavourite: 2,
          }),
        }
      );
      switch (response.status) {
        case 200:
          dispatch(wishlistActions.getWishlist(customer.customerId, token));
          return;
        default:
          showToast("Xóa sản phẩm khỏi danh sách yêu thích thất bại!");
          return;
      }
    } catch (err) {
      Alert.alert("goFAST", `Lỗi xóa sản phẩm yêu thích : ${err}`, [
        {
          text: "Tải lại",
          onPress: () => handleRemoveFavouriteProd(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.light, flex: 1, paddingBottom: 10 }}>
      <ScrollView
        horizontal={props.horizontal}
        showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      >
        {props.data.map((item, index) => (
          <CardWishlist key={item.productId} data={item} remove={handleRemoveFavouriteProd}/>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListWishList;
