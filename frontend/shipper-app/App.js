import React from "react";
import ProviderCustom from "./navigation";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./redux/reducers/auth";
import ReduxThunk from "redux-thunk";

// Khai báo các reducer và gom về 1 nguồn
const rootReducer = combineReducers({
  authReducer,
});

// Khởi tạo store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); //redux thunk cho phép các component truy cập vào store

//Componnet khởi đầu/cha
const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ProviderCustom />
      </Provider>
    </SafeAreaProvider>
  ); //Component trong file index.js
};

export default App;
