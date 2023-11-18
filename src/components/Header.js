import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import Logo from "../assets/askfunduLogo.png";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import Icon from "react-native-vector-icons/FontAwesome";
import MenuItem from "./Menu";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { userInfo } = useContext(AppContext); // Access userInfo and isLoading from your AppContext

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate("NewsScreen")}
        style={styles.logobutton}
      >
        <Image style={styles.logo} source={Logo} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => navigation.navigate("Language")}
      >
        <Icon name="language" size={24} color="#5D20D2" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Interest")}>
        <Text style={styles.text}>{t("Interest")}</Text>
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <MenuItem />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: StatusBar.length + 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    paddingTop: 18,
    zIndex: 99999999,
  },
  logo: {
    width: 110,
    height: 40,
    marginTop: 2,
  },

  languageButton: {
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 29,
    height: 27,
    paddingTop: 5,
    borderRadius: 4,
    marginTop: 2,
    shadowColor: "#f7f6f9",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    color: "#5D20D2",
    fontSize: 16,
    fontWeight: 600,
    paddingTop: 4,
  },
  logobutton: {
    marginLeft: -20,
  },
  menuContainer: {
    zIndex: 1000,
  },
});

export default Header;
