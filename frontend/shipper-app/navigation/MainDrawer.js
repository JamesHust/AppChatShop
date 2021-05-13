import React from "react";
import HomeScreen from "../screens/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../screens/DrawerContent";
import ProfileScreen from "../screens/ProfileScreen";
import TakingMissionScreen from "../screens/TakingMissionScreen";
import MissionStack from "./MissionStack";
import SupportScreen from "../screens/SupportScreen";
import SettingScreen from "../screens/SettingScreen";
import DebtScreen from "../screens/DebtScreen";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Mission"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Mission" component={MissionStack} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="TakingMission" component={TakingMissionScreen} />
      <Drawer.Screen name="Support" component={SupportScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Debt" component={DebtScreen} />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
