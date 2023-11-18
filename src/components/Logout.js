import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../context/AppContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Logout({ navigation }) {
  const { setUserInfo, setToken, setAccessToken } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setAccessToken(null);
      setToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.clear(); // Clear all AsyncStorage data
      navigation.navigate("NewsScreen");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);
  return <></>;
}
