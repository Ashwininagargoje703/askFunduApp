import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

const RoomsSkeleton = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftcontainer}>{/* StarRating */}</View>
      <View style={styles.rightcontainer}>
        <Text style={styles.username} onPress={handleNavigate}></Text>
        <Text style={styles.knowledge}>{/* Knowledge text */}</Text>
        <Text style={styles.knowledge2}>{/* Session Charge text */}</Text>
        <Text style={styles.languages}>{/* Language text */}</Text>
        <View style={styles.buttoncontainer}>{/* BookSlot */}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 5,
    flexDirection: "row",
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3a4044",
    paddingBottom: 5,
  },
  leftcontainer: {
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightcontainer: {
    padding: 10,
    marginRight: 10,
    lineHeight: 25,
  },
  knowledge: {
    marginRight: 100,
    color: "#313342",
    lineHeight: 25,
  },
  knowledge2: {
    marginRight: 100,
    color: "#898989",
  },
  languages: {
    color: "#898989",
    lineHeight: 25,
  },
  boldText: {
    fontWeight: "700",
  },
  buttoncontainer: {
    alignItems: "flex-start",
    width: 250,
    height: 50,
  },
});

export default RoomsSkeleton;
