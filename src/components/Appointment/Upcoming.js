import React, { useState, useEffect, useContext, useRef } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { AppContext } from "../../context/AppContext";
import { backend_url } from "../../../https-common";
import NoAppointment from "./NoAppointment";
import CometChatScreen from "../../screens/CometChatScreen";
import UpcomingCardSingleItem from "./UpcomingCardSingleItem";
import { CometChat } from "@cometchat-pro/react-native-chat";
import { loginUser } from "../../cometchat_init";
import Bottom from "../../screens/Bottom";

const BookedSlotCard = ({ slotData, isUserExpert, handleSetDetails }) => {
  return (
    <>
      <FlatList
        data={slotData.booked_slots}
        keyExtractor={({ item, index }) =>
          Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 1000)
        }
        renderItem={({ item }) => (
          <UpcomingCardSingleItem
            isUserExpert={isUserExpert}
            handleSetDetails={handleSetDetails}
            slotData={slotData}
            item={item}
          />
        )}
      />
    </>
  );
};

const UpcomingCard = ({ navigation }) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const { token, userInfo } = useContext(AppContext);
  const [isUserExpert, setIsUserExpert] = useState(false);
  const [isClickedOnChat, setIsClickedOnChat] = useState(false);
  const [details, setDetails] = useState({
    username: "",
    timing: "",
    date: "",
  });

  const handleSetDetails = async (value) => {
    let d = await loginUser(userInfo.username);

    setDetails({
      username: value.username,
      timing: value.timing,
      date: value.date,
    });
    // setIsClickedOnChat(true);
    if (d) {
      navigation.navigate("CometChatScreen", {
        chatWithUid: value.username,
        setIsClickedOnChat,
      });
    }
  };

  const getBookedSlotsByUser = async () => {
    try {
      //   console.log("Fetching current user...");
      // let currUser = await fetch(
      //   `${backend_url}/get-user-by-name/${userInfo.username}`
      // );

      if (!userInfo?.isExpert) {
        setIsUserExpert(false);
        let response = await fetch(
          `${backend_url}/experts/get-booked-slot-by-username/${userInfo.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`, // Make sure to replace 'token' with the actual token value
            },
          }
        );
        let responseData = await response.json();
        setBookedSlots(responseData?.slots);
        // console.log("Non-expert slots data:", responseData?.slots);
      } else {
        setIsUserExpert(true);
        let response = await fetch(
          `${backend_url}/experts/get-expert-slot-by-username/${userInfo.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`, // Make sure to replace 'token' with the actual token value
            },
          }
        );

        // console.log("Response for expert slots:", response); // Log the response

        let responseData = await response.json();
        // console.log("Expert slots data:", responseData);
        setBookedSlots(responseData?.slots);
        // console.log("Expert slots data:", responseData);
      }
    } catch (e) {
      console.error("An error occurred:", e);
      setBookedSlots([]);
    }
  };

  useEffect(() => {
    if (userInfo?.username) {
      getBookedSlotsByUser();
    } else {
      setBookedSlots([]);
    }
  }, [userInfo]);

  return (
    <>
      {!isClickedOnChat ? (
        <View style={styles.container}>
          {bookedSlots?.length === 0 ? (
            <NoAppointment unique_id={bookedSlots?.unique_id} />
          ) : (
            <FlatList
              data={bookedSlots}
              keyExtractor={(item, index) =>
                Math.floor(Math.random() * 1000) *
                Math.floor(Math.random() * 1000)
              }
              renderItem={({ item }) => (
                <BookedSlotCard
                  slotData={item}
                  isUserExpert={isUserExpert}
                  handleSetDetails={handleSetDetails}
                />
              )}
            />
          )}
        </View>
      ) : (
        <CometChatScreen
          navigation={navigation}
          chatWithUid={details.username}
          setIsClickedOnChat={setIsClickedOnChat}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  avatar: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: "#D8D1E3",
    borderRadius: 19,
  },
  details: {
    marginLeft: 10,
  },
  name: {
    fontWeight: "600",
    color: "black",
  },
  role: {
    color: "#8c8c8c",
    fontSize: 12,
  },
  timing: {
    fontWeight: "600",
    marginTop: 4,
  },
  bookedDate: {
    fontWeight: "600",
    marginTop: 4,
  },
});

export default UpcomingCard;
