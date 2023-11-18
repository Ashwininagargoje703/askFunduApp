import {
  Dimensions,
  StyleSheet,
  StatusBar,
  useColorScheme,
  View,
  Button,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./src/context/AppContext";
import { useTranslation } from "react-i18next";
import AllRoutes from "./src/screens/AllRoutes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import registerForPushNotificationsAsync from "./NotificationInit";
import CometchatInit, { loginUser } from "./src/cometchat_init";
import {
  CometChatMessages,
  CometChatUI,
  CometChatUserListWithMessages,
} from "./cometchat-pro-react-native-ui-kit/CometChatWorkspace/src";
import MYRoute, { RootNavigator } from "./src/screens/MainRoutes";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Bottom from "./src/screens/Bottom";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function App({ navigation, sUrl }) {
  const {
    setUserInfo,
    userInfo,
    setAccessToken,
    setToken,
    isDeviceTokenExistsAndSave,
    setInitUrl,
    setSs,
  } = useContext(AppContext);
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "477666885602-4iqsbjjrv34uhuval0vn1bt2u6cvcnv7.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  const getTokenFromNotification = async () => {
    const { token, fcmToken } = await registerForPushNotificationsAsync();
    if (
      userInfo &&
      (userInfo?.deviceToken == undefined || userInfo?.deviceToken == false)
    ) {
      isDeviceTokenExistsAndSave(token, fcmToken);
    }
  };

  useEffect(() => {
    getTokenFromNotification();
  }, [userInfo]);

  useEffect(() => {
    if (sUrl !== null) {
      let brk = sUrl.split("/");

      if (Array.isArray(brk)) {
        if (brk.length > 0) {
          let screen = brk[brk.length - 2];
          let id = brk[brk.length - 1];
          setInitUrl(id);
          setSs(screen);
        }
      }
    }
  }, [sUrl]);

  async function getSelectedLanguageAndInfoFromStorage() {
    try {
      let lan = await AsyncStorage.getItem("selectedLanguage");
      if (lan) {
        i18n.changeLanguage(lan);
      }

      let user = await AsyncStorage.getItem("user");
      let token = await AsyncStorage.getItem("token");
      let accessTokenFromStorage = await AsyncStorage.getItem("accessToken");
      user = JSON.parse(user);
      token = JSON.parse(token);
      accessTokenFromStorage = JSON.parse(accessTokenFromStorage);

      if (accessTokenFromStorage) {
        setAccessToken(accessTokenFromStorage);
      }
      if (user) {
        setUserInfo(user);
        setToken(token);
        navigation.navigate("NewsScreen");
      }
    } catch (e) {
      console.log("Something went wrong:", e.message);
    }
  }

  useEffect(() => {
    getSelectedLanguageAndInfoFromStorage();
  }, []);
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   if (userInfo) {
  //     // login(userInfo.username);
  //   }
  // }, [userInfo]);

  const handleOpenCometChat = () => {
    loginUser("ashwininagargoje");
  };

  return (
    <>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* <RootNavigator /> */}
      <AllRoutes />
      {/* <Bottom /> */}

      {/* <Button title="Login to Cometchat" onPress={handleOpenCometChat} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: WINDOW_WIDTH,
    paddingHorizontal: 10,
  },
  webView: {
    flex: 1,
    marginTop: StatusBar.length + 10,
  },
});
