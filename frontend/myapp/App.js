import React from "react";
import ProviderCustom from "./navigation";
import { Provider } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./redux/reducers/auth";
import cartReducer from "./redux/reducers/cart";
import wishlistReducer from "./redux/reducers/wishlist";
import boardChatReducer from "./redux/reducers/board-chat";
import ReduxThunk from "redux-thunk";

// Khai báo các reducer và gom về 1 nguồn
const rootReducer = combineReducers({
  authReducer,
  cartReducer,
  wishlistReducer,
  boardChatReducer
});

// Khởi tạo store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); //redux thunk cho phép các component truy cập vào store

//Componnet khởi đầu/cha
const App = () => {
  //import font chữ
  const [loaded] = useFonts({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ProviderCustom />
      </Provider>
    </SafeAreaProvider>
  ); //Component trong file index.js
};

export default App;
