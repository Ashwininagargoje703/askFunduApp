import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "../../context/AppContext";
import { backend_url } from "../../../https-common";
import { Image } from "react-native";
import { convertTimeTo12HourFormat } from "../../common";
import { Avatar } from "react-native-paper";
import Bottom from "../../screens/Bottom";

const BookedSlotCard = ({ slotData, isUserExpert }) => {
  const userSlot = slotData.booked_slots[0]; // Assuming only one slot is booked in each entry

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <Avatar.Image
            size={35}
            style={{ marginTop: 4.5 }}
            source={{
              uri: item?.userDetails?.userpic_url,
            }}
          />
          <View style={styles.details}>
            <Text style={styles.name}>
              {item.userDetails?.First_Name} {item.userDetails?.last_name}
            </Text>
            <Text style={styles.role}>
              ({!isUserExpert ? "Expert" : "Booked By"})
            </Text>
            <Text style={styles.timing}>
              Timings: {userSlot.timing?.from.join(":")} -{" "}
              {userSlot.timing?.to.join(":")}
            </Text>
            <Text style={styles.bookedDate}>
              Booked Date:{" "}
              {isUserExpert ? slotData.booking_day : slotData?.booked_date}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={slotData.booked_slots}
      keyExtractor={({ item, index }) =>
        Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 1000)
      }
      renderItem={renderItem}
    />
  );
};

const CompletedCard = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const { token, userInfo } = useContext(AppContext);
  const [isUserExpert, setIsUserExpert] = useState(false);

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
        setBookedSlots(responseData?.completedSlots);
        // console.log("Non-expert slots data:", responseData?.completedSlots);
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

        let responseData = await response.json();
        // console.log("Response for expert slots:", responseData); // Log the response
        setBookedSlots(responseData?.completedSlots);
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
      <View style={styles.container}>
        <FlatList
          data={bookedSlots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <BookedSlotCard slotData={item} isUserExpert={isUserExpert} />
          )}
        />
      </View>
      {/* <Bottom />s */}
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

export default CompletedCard;
