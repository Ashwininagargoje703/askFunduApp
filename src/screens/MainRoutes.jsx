import React from "react";
import { View, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import NewsScreen from "./NewsScreen";
import PostScreen from "./PostScreen";
import RoomScreen from "./RoomScreen";
import Language from "../components/Language";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AllRoutes, { CustomHeader } from "./AllRoutes";
import MainCreatPost from "../components/CreatePost";
import { AntDesign as AntDesignIcon } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

export default function MYRoute() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={{
            backgroundColor: "white",
            borderTopColor: "#bec1c8",
            borderWidth: 1,
            height: 70,
          }}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 22 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="NewsScreen"
        component={AllRoutes}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          header: () => <CustomHeader navigation={navigation} />, // Use custom header here
        }}
      />

      <Tab.Screen
        name="Social"
        component={PostScreen}
        options={{
          tabBarLabel: "Social",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesomeIcons name="users" size={size} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name="post"
        component={MainCreatPost}
        options={{
          tabBarLabel: "Post",
          tabBarIcon: ({ color, size }) => {
            return <AntDesignIcon name="pluscircleo" size={22} color="black" />;
          },
        }}
      />

      <Tab.Screen
        name="Rooms"
        component={RoomScreen}
        options={{
          tabBarLabel: "Rooms",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="laptop" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Language"
        component={Language}
        options={{
          tabBarLabel: "Language",
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesomeIcons name="language" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

export const RootNavigator = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="MainTabs"
      component={MYRoute}
      options={{ headerShown: false }}
    />
  </RootStack.Navigator>
);
