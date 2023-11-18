import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import StarRating from "./Ratings";
import Search from "./Roomsearch";
import BookSlot from "./BookSlot";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { AppContext } from "../../context/AppContext";

const RoomsList = ({ item }) => {
  const filteredKnowledge = item?.knowledge.filter((item) => item !== "");
  const knowledgeString = filteredKnowledge.join(" | ");
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const { userInfo } = useContext(AppContext);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleNavigate = () => {
    console.log("Post ID:", item?.userDetails?.username); // Check if 'item.unique_id' has a valid value
    navigation.navigate("ExpertProfile", {
      username: item?.username,
    });
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftcontainer}>
          <Avatar.Image
            size={90}
            source={{
              uri: item?.userDetails?.userpic_url
                ? item?.userDetails?.userpic_url
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_yIbHjzrzghXkTcOahJZn0eZCjyyLZ_lOg&usqp=CAU",
            }}
          />

          <StarRating rating={item?.rating} />
        </View>
        <View style={styles.rightcontainer}>
          <Text style={styles.username} onPress={handleNavigate}>
            {item?.userDetails?.First_Name} {item?.userDetails?.last_name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              // Align items vertically in the center
              width: "75%",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                flex: 1, // Allow the text to take up available space
                fontSize: 14,
                lineHeight: 22,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              {expanded ? knowledgeString : knowledgeString.slice(0, 30)}
            </Text>
            {knowledgeString && knowledgeString.length > 30 && (
              <TouchableOpacity
                onPress={handleToggleExpand}
                style={{
                  fontSize: 10,
                  color: "black",
                  marginTop: 9,
                  marginRight: "-18%",
                }}
              >
                <Text>
                  {expanded ? (
                    <Icon name="up" size={12} color="black" />
                  ) : (
                    <Icon name="down" size={12} color="black" />
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.knowledge2}>
            <Text style={styles.boldText}>Session Charge : </Text>₹{" "}
            {item?.services && item?.services.length > 0
              ? item?.services[0].price
              : 1}{" "}
            {/* /{" "}
            {item?.services && item?.services.length > 0
              ? item?.services[0].duration
              : 30}{" "}
            min */}
          </Text>

          <Text style={styles.languages}>
            <Text style={styles.boldText}>Language : </Text>{" "}
            {item?.languages?.join("/")}
          </Text>
          {!userInfo?.isExpert && (
            <View style={styles.buttoncontainer}>
              <BookSlot username={item.username} />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 10,
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
    // backgroundColor: "pink",
  },
  knowledge2: {
    marginRight: 100,
    color: "#898989",
  },
  knowledge: {
    marginRight: 100,
    color: "#313342",
    // fontWeight: "600",
    lineHeight: 25,
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
    // backgroundColor: "pink",
  },
});

export default RoomsList;
