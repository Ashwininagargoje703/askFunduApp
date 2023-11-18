import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import NewsScreen from "./NewsScreen";
import Login from "../components/Login";
import Intrest from "../components/Intrests";
import Language from "../components/Language";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"; // Replace 'FontAwesome' with the icon pack you want to use
import { useColorScheme } from "react-native";
import Logout from "../components/Logout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton } from "react-native-paper";
import PostScreen from "./PostScreen";
import SinglePostScreen from "./SinglePostScreen";
import RoomScreen from "./RoomScreen";
import { capitalFirstLetter } from "../common";
import { BackHandler } from "react-native";
import PofileScreen from "./ProfileScreen";
import {
  CometChatMessages,
  CometChatUI,
  CometChatUserListWithMessages,
} from "../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src";
import UserPostScreen from "./UserPostScreen";
import UserPostTab from "../components/Profile/UserPostTab";
import AppointmentTab from "../components/Appointment/AppointmentTabs";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import CometChatScreen from "./CometChatScreen";
import VerticalTabs from "../components/Rooms/Filter";
import Search from "../components/Rooms/Roomsearch";

export const CustomHeader = ({ navigation }) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };
  const handleLogoPress = () => {
    navigation.navigate("NewsScreen");
  };
  const colorScheme = useColorScheme();

  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <TouchableOpacity style={styles.menuIcon} onPress={openDrawer}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={{
              uri: "https://web.askfundu.com/static/media/askfunduLogo.8d6f3f280186de132173.png",
            }}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => navigation.navigate("Language")}
      >
        <Image
          source={{
            uri: "https://i.ibb.co/Tk7x8wk/Icon-removebg-preview.png",
          }}
          style={styles.language}
        />
      </TouchableOpacity>
    </View>
  );
};

export const CustomDrawerContent = (props) => {
  const { userInfo } = useContext(AppContext);
  const handleCloseButton = () => {
    console.log("Close button clicked");
    props.navigation.closeDrawer();
  };

  const { state, ...rest } = props;
  const { routes, index } = state;
  const filteredRoutes = routes.filter(
    (route, i) => i !== index && route.name !== "PostDetail"
  );
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer2}>
        <TouchableOpacity onPress={handleCloseButton}>
          <IconButton
            icon="close"
            color="#000"
            onPress={() => handleCloseButton()}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://web.askfundu.com/static/media/askfunduLogo.8d6f3f280186de132173.png",
            }}
            style={styles.logo}
          />
        </View>
      </View>

      {userInfo !== null && (
        <View style={styles.userInfoContainer}>
          <Avatar.Image
            size={33}
            style={{ marginLeft: 14, marginTop: 4.5 }}
            source={{
              uri: userInfo.userpic_url,
            }}
          />
          <Text style={styles.userInfoText}>
            {" "}
            {`${capitalFirstLetter(userInfo?.First_Name)} ${capitalFirstLetter(
              userInfo?.last_name
            )} `}
          </Text>
        </View>
      )}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNaviagator = (props) => {
  const { userInfo, setUserInfo, setToken, accessToken, setAccessToken, ss } =
    useContext(AppContext);

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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="NewsScreen"
      backBehavior="history"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialParams={{}}
      screenOptions={({ navigation, route }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "black",
        cardStyle: {
          backgroundColor: "black",
          zIndex: 0,
        },

        drawerActiveTintColor: "#5d20d2",
        drawerLabel: ({ focused, color }) => {
          if (route.name === "Login" && userInfo !== null) {
            return null; // Don't show the "Login" button if userInfo is null
          }

          if (route.name === "PostDetails" || route.name === "ExpertProfile") {
            return null;
          }
          return (
            <Text
              style={{
                color: focused ? "#5d20d2" : "black",
                fontWeight: focused ? "600" : "500",
              }}
            >
              {route.name}
            </Text>
          );
        },
      })}
    >
      <Drawer.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="newspaper-o" color={color} size={17} />
          ),
        }}
      />

      <Drawer.Screen
        name="Social"
        component={PostScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="users" color={color} size={17} />
          ),
        }}
      />

      <Drawer.Screen
        name="Rooms"
        component={RoomScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="laptop" color={color} size={20} />
          ),
        }}
      />

      <Drawer.Screen
        name="Chats"
        component={AppointmentTab}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="user-plus" color={color} size={20} />
          ),
        }}
      />

      {userInfo === null ? (
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="sign-in" color={color} size={22} />
            ),
          }}
        />
      ) : null}
      <Drawer.Screen
        name="Language"
        component={Language}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="language" color={color} size={22} />
          ),
        }}
      />
      <Drawer.Screen
        name="Interests"
        component={Intrest}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={22} />
          ),
        }}
      />

      {userInfo !== null && (
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="sign-out" color={color} size={22} />
            ),
            drawerLabel: ({ focused, color }) => (
              <TouchableOpacity onPress={handleLogout}>
                {/* <Icon name="sign-out" color={color} size={22} /> */}
                <Text
                  style={{
                    color: focused ? "#5d20d2" : "black",
                    fontWeight: focused ? "600" : "500",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      )}

      {/* <Drawer.Screen name="PostDetails" component={SinglePostScreen} />
      <Drawer.Screen name="ExpertProfile" component={PofileScreen} /> */}
    </Drawer.Navigator>
  );
};

const AllRoutes = (props) => {
  // Nesting Drawer Navigator to stack navigator for other routes
  return (
    <Stack.Navigator
      initialRouteName="DrawerNavigator"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerNavigator" component={DrawerNaviagator} />
      <Stack.Screen name="PostDetails" component={SinglePostScreen} />
      <Stack.Screen name="ExpertProfile" component={PofileScreen} />
      <Stack.Screen name="CometChatScreen" component={CometChatScreen} />
      <Stack.Screen name="CometChatUIScreen" component={CometChatUI} />
      <Stack.Screen name="CometChatMessages" component={CometChatMessages} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    zIndex: 0,
    color: "black",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 4,
    marginBottom: 10,
    height: 45,
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 21,
    marginTop: 7.5,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    color: "black",
  },

  closeIconContainer: {
    position: "absolute",
    left: 7,
  },

  logoContainer: {
    flex: 1,
    marginLeft: 75,
  },
  userInfoContainer2: {
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#b7b7b7",
    backgroundColor: "white",
    color: "black",
  },
  menuIcon: {
    marginRight: 16,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  dummyIcon: {
    flex: 1,
  },
  language: {
    width: 25,
    height: 27,
  },
});

export default AllRoutes;
