import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Menu, Divider, PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";

const MenuItem = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <PaperProvider>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
          marginTop: 10,
          zIndex: 1000,
        }}
      >
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Icon name="menu" size={30} color="#000" />
            </TouchableOpacity>
          }
          style={{
            marginLeft: -270,
            width: 120,
            height: "100%",
            position: "relative",
          }}
        >
          {userInfo !== null ? (
            <Menu.Item onPress={() => {}} title={userInfo.First_Name} />
          ) : (
            <Menu.Item
              onPress={() => navigation.navigate("Login")}
              title={t("Login")}
            />
          )}
        </Menu>
      </View>
    </PaperProvider>
  );
};

export default MenuItem;
