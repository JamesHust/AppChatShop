import React from "react";
import ProviderCustom from "./navigation";
import { Provider } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { createStore, combineReducers, applyMiddleware } from "redux";
import customerReducer from "./redux/reducers/customer";
import ReduxThunk from "redux-thunk";

const rootReducer = combineReducers({
  customer: customerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

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
