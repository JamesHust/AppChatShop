import React from "react";
import Providers from "./navigation";
import { useFonts } from 'expo-font';

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
  return <Providers />; //Component trong file index.js
};

export default App;
