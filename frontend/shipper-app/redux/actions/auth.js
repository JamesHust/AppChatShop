import AsyncStorage from "@react-native-async-storage/async-storage"; //thư viện tương tác với Storage
import { Alert } from "react-native";

//Khai báo các type của authAction
export const SAVE_TOKEN = "SAVE_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";