import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainCreatPost from "../components/CreatePost";

const Bottom = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route information
  const [activeIcon, setActiveIcon] = useState("news");

  useEffect(() => {
    setActiveIcon(route.name.toLowerCase());
  }, [route]);

  const handlePress = () => {
    navigation.navigate("NewsScreen");
  };

  const handlePress2 = () => {
    navigation.navigate("Social");
  };

  const handlePress3 = () => {
    navigation.navigate("Rooms");
  };

  const handlePress4 = () => {
    navigation.navigate("Chats");
  };

  return (
    <View style={styles.bottomMenuContainer}>
      <View style={{ alignItems: "center" }}>
        <Icon
          name="newspaper-o"
          onPress={handlePress}
          size={22}
          color={
            activeIcon === "news" || route.name === "NewsScreen"
              ? "#5d20d2"
              : "#595959"
          }
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            color:
              activeIcon === "news" || route.name === "NewsScreen"
                ? "#5d20d2"
                : "#595959",
          }}
        >
          News
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Icon
          name="users"
          onPress={handlePress2}
          size={22}
          color={activeIcon === "social" ? "#5d20d2" : "#595959"}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: activeIcon === "social" ? "#5d20d2" : "#595959",
          }}
        >
          Social
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <MainCreatPost />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: "#595959",
          }}
        >
          Post
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Icon
          name="laptop"
          onPress={handlePress3}
          size={22}
          color={activeIcon === "rooms" ? "#5d20d2" : "#595959"}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 1,
            color: activeIcon === "rooms" ? "#5d20d2" : "#595959",
          }}
        >
          Rooms
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Icon
          name="user-plus"
          onPress={handlePress4}
          size={22}
          color={activeIcon === "Chats" ? "#5d20d2" : "#595959"}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: activeIcon === "Chats" ? "#5d20d2" : "#595959",
          }}
        >
          Chats
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    position: "absolute",
    bottom: 0, // This ensures it's at the bottom
    width: "100%", // Makes it take the full width
  },
  bottomMenuItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  bottomMenuText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  activeIcon: {
    color: "#5d20d2",
  },
  bottomMenuItem: {
    alignItems: "center",
  },
});

export default Bottom;
