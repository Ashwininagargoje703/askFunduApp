import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/FontAwesome";
import { backend_url } from "../../https-common";
import { AppContext } from "../context/AppContext";

const Login = ({ navigation }) => {
  const { setUserInfo, setAccessToken, setToken } = useContext(AppContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const signInFromGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      createUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log("if err", error);
      setLoading(false);
    }
  };

  const createUser = (userInfo) => {
    let form = {
      ...userInfo.user,
      picture: userInfo?.user?.photo,
    };
    const payloadjson = JSON.stringify({ code: form });
    fetch(`${backend_url}/users/create-user-for-mobile`, {
      method: "POST",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((rr) => {
        setUserInfo(rr.user);
        setToken(rr.token);
        setUserToStorage(rr.user, rr.token, userInfo.idToken);
        navigation.navigate("NewsScreen");
      })
      .catch((err) => console.log(err));
  };

  //  functions for interacting with async storage
  const setUserToStorage = async (user, token, idTokenGoogle) => {
    try {
      setAccessToken(idTokenGoogle);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", JSON.stringify(token));
      await AsyncStorage.setItem("accessToken", JSON.stringify(idTokenGoogle));
      setLoading(false);
    } catch (e) {
      console.log("Something went wrong:", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.ibb.co/6BhjndZ/Mobile-LOgin121415111.png",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.mainView}>
          <Image
            style={styles.logo}
            source={{
              uri: "https://web.askfundu.com/static/media/askfunduLogo.8d6f3f280186de132173.png",
            }}
          />
          <Text style={styles.title}>
            {t("Welcome! Sign in to get started")}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={signInFromGoogle}>
              <Icon name="google" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{t("Continue with Google")}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.disclaimer}>
            {t("By signing up, you agree to our")}
          </Text>
          <View style={styles.policyContainer}>
            <TouchableOpacity
              style={styles.policyLink}
              onPress={() => Linking.openURL("https://web.askfundu.com/terms")}
            >
              <Text style={styles.policyText}>{t("Terms of Service")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.policyLink}
              onPress={() =>
                Linking.openURL("https://web.askfundu.com/refund-policy")
              }
            >
              <Text style={styles.policyText}>{t("Refund Policy")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.policyLink}
              onPress={() =>
                Linking.openURL("https://web.askfundu.com/privacy-policy")
              }
            >
              <Text style={styles.policyText}>{t("Privacy Policy")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: "center",
  },

  mainView: {
    position: "absolute",
    width: 343,
    height: 290,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#D8D1E3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  buttonIcon: {
    marginRight: 10,
    color: "#5d20d2",
  },
  buttonText: {
    color: "black",
  },
  disclaimer: {
    fontSize: 16,
    marginTop: 30,
    justifyContent: "center",
    textAlign: "center",
  },
  policyContainer: {
    marginTop: 10,
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
  },
  policyLink: {
    fontSize: 16,
    marginHorizontal: 4,
  },

  policyText: {
    color: "#5d20d2",
  },
});
export default Login;
