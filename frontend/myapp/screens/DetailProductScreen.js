import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import { addDotToNumber, showToast } from "../utils/Common";
import { AntDesign } from "@expo/vector-icons";
import RatingStar from "../components/RatingStar";
import ReadMore from "react-native-read-more-text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage

const DetailProductScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(1);
  // Thông tin sản phẩm
  const idProduct = route.params.idProduct;
  const [data, setData] = useState({
    product: {
      productId: "",
      imageUrl:
        "https://www.flaticon.com/svg/vstatic/svg/812/812850.svg?token=exp=1619003978~hmac=c7940ae416e210578fa00f6b23b02de2",
      productName: "",
      purchasePrice: "",
      rating: "",
      quantitySold: "",
      unit: "",
      description: "",
    },
    cate: {
      categoryName: "",
    },
    shop: {
      shopId: "",
      shopName: "",
    },
  });
  const [favourite, setFavourite] = useState(false); //yêu thích sản phẩm không?
  const [rating, setRating] = useState(0); //đánh giá sao cho sản phẩm
  const dispatch = useDispatch(); //khởi tạo dispatch
  const customer = useSelector((state) => state.authReducer.customer);

  //Hàm giảm số lượng
  const reduceAmount = () => {
    if (amount > 1) {
      setAmount((amount) => amount - 1);
    } else setAmount(1);
  };

  //Hàm tăng số lượng
  const increasingAmount = () => {
    setAmount((amount) => amount + 1);
  };

  // Hiển thị khi co đoạn text
  const renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{ color: COLORS.red_13, marginTop: 5 }}
        onPress={handlePress}
      >
        Chi tiết
      </Text>
    );
  };

  // Hiển thị khi đang hiện thị toàn bộ đoạn text
  const renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{ color: COLORS.red_13, marginTop: 5 }}
        onPress={handlePress}
      >
        Thu gọn
      </Text>
    );
  };

  // Hàm load đánh giá sản phẩm
  const loadReview = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://192.168.0.4:3000/api/reviews/products?idProduct=${idProduct}&idCustomer=${customer.customerId}`,
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
          if (resData) {
            if (resData.data.isFavourite === 1) {
              setFavourite(true);
            } else {
              setFavourite(false);
            }
            setRating(resData.data.rating);
          }
          return;
        default:
          return Alert.alert("goFAST", `Lỗi tải đánh giá:`, [
            {
              text: "Tải lại",
              onPress: () => loadReview(),
            },
            {
              text: "Hủy",
              style: "cancel",
            },
          ]);
      }
    } catch (err) {
      return Alert.alert("goFAST", `Lỗi tải đánh giá sản phẩm: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadProduct(),
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }
  };

  // Hàm load dữ liệu chi tiết sản phẩm
  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    //fetching data ở đây
    try {
      const response = await fetch(
        `http://192.168.0.4:3000/api/products/${idProduct}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      switch (response.status) {
        case 200:
          const resData = await response.json();
          setData(resData.data);
          await loadReview();
          setIsLoading(false);
          return;
        default:
          setIsLoading(false);
          Alert.alert("goFAST", `Lỗi tải dữ liệu:`, [
            {
              text: "Tải lại",
              onPress: () => loadProduct(),
            },
            {
              text: "Hủy",
              style: "cancel",
            },
          ]);
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi tải dữ liệu: ${err}`, [
        {
          text: "Tải lại",
          onPress: () => loadProduct(),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    }
  }, [setIsLoading]);

  // Hàm cập nhật đánh giá sản phẩm
  const updateReview = async (rating, isFavourite) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://192.168.0.4:3000/api/reviews/products`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            idCustomer: customer.customerId,
            idProduct: idProduct,
            rating: rating,
            isFavourite: isFavourite,
          }),
        }
      );
      switch (response.status) {
        case 200:
          showToast("Cập nhật đánh giá thành công");
          return;
        default:
          showToast("Cập nhật đánh giá thất bại")
          return;
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("goFAST", `Lỗi cập nhật đánh giá: ${err}`, [
        {
          text: "Cập nhật lại",
          onPress: () => updateReview(),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    }
  };

  //check thay đổi khi tải trang và khi cập nhật đánh giá
  useEffect(() => {
    loadProduct();
  }, [loadProduct, setIsLoading, setFavourite, setRating]);

  // Cập nhật rating
  const updateRating = async (rate) => {
    setRating(rate);
    await updateReview(rate, null);
  };

  // Cập nhật sản phẩm yêu thích
  const updateIsFavorite = async () => {
    let isFavorite;
    isFavorite = !favourite ? 1 : 2;
    await updateReview(null, isFavorite);
    setFavourite(!favourite);
  };

  // Hàm xử lý thêm
  const handleOrder = async (amount) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch("http://192.168.0.4:3000/api/carts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            customerId: customer.customerId,
            shopId: data.shop.shopId,
            productId: data.product.productId,
            productPrice: data.product.purchasePrice,
            productAmount: amount,
          }),
        });
        switch (response.status) {
          case 200:
            dispatch(
              cartActions.getOldCart(
                customer.CustomerId,
                token
              )
            );
            showToast(`Thêm thành công ${amount} sản phẩm mới vào giỏ!`);
            return;
          default:
            showToast(`Thêm mới sản phẩm vào giỏ thất bại!`);
            return;
        }
      } else {
        Alert.alert("goFAST", `Lỗi lấy xác thực`, [
          {
            text: "Thực hiện lại",
            onPress: () => handleOrder(),
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
          onPress: () => handleOrder(),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    }
  };

  // Trường hợp đang load dữ liệu
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.light,
        }}
      >
        {/* header */}
        <View style={styles.header}>
          {/* Quay về trang đầu */}
          <Icon
            name="arrow-back"
            size={28}
            color={COLORS.red_13}
            onPress={() => navigation.popToTop()}
          />
        </View>
        <View style={styles.containerCenter}>
          <ActivityIndicator size="large" color={COLORS.red_13} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          {/* Quay về trang đầu */}
          <Icon
            name="arrow-back"
            size={28}
            color={COLORS.red_13}
            onPress={() => navigation.popToTop()}
          />
        </View>
        {/* Thêm hoặc xóa khỏi danh sách yêu thích */}
        <View style={styles.iconAddFavourite}>
          <AntDesign
            name={!favourite ? "hearto" : "heart"}
            size={27}
            color={!favourite ? COLORS.grey_6 : COLORS.red_14}
            style={{ paddingTop: 3 }}
            onPress={updateIsFavorite}
          />
        </View>
        {/* Ảnh minh họa */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.product.imageUrl }}
            resizeMode="contain"
            style={styles.imageProduct}
          />
        </View>
        {/* Thông tin chi tiết sản phẩm */}
        <View style={styles.detailsContainer}>
          {/* Tên cửa hàng bán */}
          <View style={styles.nameStore}>
            <View style={styles.dash} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="storefront"
                size={24}
                color={COLORS.red_13}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
              >
                {data.shop.shopName}
              </Text>
            </View>
            <View style={styles.dash} />
          </View>
          {/* Đánh giá sản phẩm */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đánh giá</Text>
            </View>
            {/* Số sao đánh giá */}
            <View>
              <RatingStar rated={rating} updateRating={updateRating} />
            </View>
          </View>
          {/* Tên và giá sản phẩm */}
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                color: COLORS.dark,
                width: "75%",
              }}
            >
              {data.product.productName}
            </Text>
            {/* Giá tiền sản phẩm */}
            <View style={styles.priceTag}>
              <Text
                style={{
                  marginLeft: 15,
                  color: COLORS.light,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {addDotToNumber(data.product.purchasePrice)} ₫
              </Text>
            </View>
          </View>
          {/* Mô tả, thông tin chung sản phẩm */}
          <View style={{ marginTop: 5 }}>
            {/* Tên loại sản phẩm */}
            <Text style={{ fontSize: 16 }}>{data.cate.categoryName}</Text>
            {/* Rating của sản phẩm */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <AntDesign name="star" size={20} color={COLORS.amber} />
              {/* Đánh giá */}
              <Text
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 2,
                  color: COLORS.dark,
                  fontSize: 18,
                }}
              >
                {data.product.rating}
              </Text>
              {/* Số lượng đã bán */}
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.grey_6,
                  fontSize: 18,
                }}
              >
                ({data.product.quantitySold})
              </Text>
            </View>
            {/* Mô tả */}
            <Text
              style={{
                color: COLORS.grey_7,
                fontWeight: "bold",
                marginTop: 15,
                fontSize: 18,
              }}
            >
              Đơn vị : {data.product.unit}
            </Text>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={renderTruncatedFooter}
              renderRevealedFooter={renderRevealedFooter}
            >
              <Text
                style={{
                  color: "grey",
                  fontSize: 16,
                  lineHeight: 22,
                  marginTop: 5,
                }}
              >
                {data.product.description}
              </Text>
            </ReadMore>
          </View>
        </View>
      </ScrollView>
      {/* Tiến hành đặt mua */}
      <View style={styles.stickyContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.containerSetAmount}>
              <TouchableOpacity onPress={reduceAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...styles.buttonSetAmount,
                    backgroundColor: COLORS.grey_5,
                  }}
                >
                  <Text style={styles.iconSetAmount}>-</Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...styles.buttonSetAmount,
                }}
              >
                <Text style={{ ...styles.iconSetAmount, color: COLORS.dark }}>
                  {amount}
                </Text>
              </View>
              <TouchableOpacity onPress={increasingAmount} activeOpacity={0.8}>
                <View
                  style={{
                    ...styles.buttonSetAmount,
                    backgroundColor: COLORS.red_13,
                  }}
                >
                  <Text style={styles.iconSetAmount}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Đặt mua */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleOrder(amount)}
          >
            <View style={styles.buyBtn}>
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Thêm vào giỏ
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageProduct: {
    width: 300,
    height: 300,
  },
  detailsContainer: {
    marginTop: 5,
    backgroundColor: COLORS.light,
    marginHorizontal: 20,
    marginBottom: 7,
    borderRadius: 20,
    paddingTop: 15,
  },
  borderBtn: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
  },
  borderBtnText: { fontWeight: "bold", fontSize: 28 },
  buyBtn: {
    width: 180,
    height: 45,
    backgroundColor: COLORS.red_13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  priceTag: {
    backgroundColor: COLORS.red_13,
    width: 100,
    height: 40,
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    position: "absolute",
    right: -20,
  },
  stickyContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.grey_4,
  },
  containerSetAmount: {
    flexDirection: "row",
    overflow: "hidden",
  },
  buttonSetAmount: {
    width: 35,
    height: 35,
    justifyContent: "center",
    borderRadius: 15,
  },
  iconSetAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.light,
    textAlign: "center",
  },
  iconAddFavourite: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 3,
  },
  nameStore: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dash: {
    height: 1,
    width: 100,
    backgroundColor: COLORS.grey_5,
  },
});

export default DetailProductScreen;
