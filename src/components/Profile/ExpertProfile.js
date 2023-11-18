import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Image } from "react-native";
import StarRating from "../Rooms/Ratings";
import About from "./About";
import NewBooksSlots from "./NewBookSlots";
import SliderBookSlot from "./SliderBookslot";
import UserPostTab from "./UserPostTab";
import { Dimensions } from "react-native";
import { AppContext } from "../../context/AppContext";

const WINDOW_WIDTH = Dimensions.get("window").width;

const ProfileExpert = React.memo(({ expert }) => {
  const filteredKnowledge = expert?.knowledge.filter((item) => item !== "");
  const knowledgeString = filteredKnowledge.join(" | ");
  const { userInfo } = useContext(AppContext);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftcontainer}>
          <Image
            source={{
              uri: expert?.userDetails?.userpic_url
                ? expert?.userDetails?.userpic_url
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_yIbHjzrzghXkTcOahJZn0eZCjyyLZ_lOg&usqp=CAU",
            }}
            style={{
              height: 120,
              width: 100,
              borderRadius: 8,
            }}
          />
          <StarRating rating={expert?.rating} />
        </View>
        <View style={styles.rightcontainer}>
          <Text style={styles.username}>
            {expert?.userDetails?.First_Name} {expert?.userDetails?.last_name}
          </Text>
          <Text style={{ color: "#6b7280" }}>
            {expert?.userDetails?.username}
          </Text>
          <View style={styles.knowledgeContainer}>
            <Text style={styles.knowledge}>{knowledgeString}</Text>
          </View>

          <Text style={styles.languages}>
            <Text style={styles.boldText}>Language : </Text>{" "}
            {expert?.languages?.join("/")}
          </Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{expert?.postsCount} Posts</Text>
            <Text style={styles.statsText}>
              {expert?.followingsCount} Following
            </Text>
            <Text style={styles.statsText}>
              {expert?.followersCount} Followers
            </Text>
          </View>
        </View>
      </View>
      {!userInfo?.isExpert && <SliderBookSlot username={expert.username} />}
      <About expert={expert} />
      {/* <NewBooksSlots username={expert.username} /> */}
      <UserPostTab username={expert.userDetails.username} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 5,
    flexDirection: "row",
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3a4044",
    paddingBottom: 2,
  },
  leftcontainer: {
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    justifyContent: "center",
    alignitems: "center",
  },
  rightcontainer: {
    padding: 10,
    marginRight: 10,
    lineHeight: 25,

    // backgroundColor: "pink",
  },

  knowledgeContainer: {
    // Display text in a row (horizontal)
    marginTop: 4,
    width: 230,
    paddingRight: 10,
    // backgroundColor: "pinkss",
  },
  knowledge: {
    color: "#313342",
    lineHeight: 25,
    marginRight: 5,
    flexWrap: "wrap",
  },
  languages: {
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    alignitems: "center",
    marginTop: 4,
    // Align items vertically within the view
  },
  statsText: {
    fontWeight: "bold",
    color: "#5D20D2",
    fontSize: 14,
    marginRight: 10,
    marginTop: 3, // Add spacing between the text components
  },
  boldText: {
    fontWeight: "700",
    color: "#3a4044",
  },
  buttoncontainer: {
    alignitems: "flex-start",
    width: 250,
    height: 50,
    // backgroundColor: "pink",
  },
});

export default ProfileExpert;
