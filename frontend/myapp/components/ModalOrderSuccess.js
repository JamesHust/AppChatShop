import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Modal from "react-native-modal";
import COLORS from "../constants/color";
import { AntDesign } from "@expo/vector-icons";

//Danh sách menu
const ModalOrderSuccess = (props) => {
  return (
    <View>
      {/* Modal hỗ trợ khách hàng */}
      <Modal
        isVisible={props.onVisible}
        backdropColor={props.backdropColor}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
      >
        <View style={styles.container}>
          <AntDesign name="checkcircle" size={80} color={COLORS.green_13} />
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              marginTop: 10,
              paddingHorizontal: 15,
              color: COLORS.light,
            }}
          >
            Đặt hàng thành công!
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.blue_grey_4,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: COLORS.red_13,
    height: 200,
  },
});

export default ModalOrderSuccess;
