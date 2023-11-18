import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { backend_url } from "../../../https-common";
import { Dimensions } from "react-native";
import { convertTimeTo12HourFormat } from "../../common";
import { AppContext } from "../../context/AppContext";
import * as WebBrowser from "expo-web-browser";
import useMakeCometChatProfile from "../../hooks/useCometChatSdk";
const screenWidth = Dimensions.get("window").width;

const Slot = ({ username }) => {
  const [currentDateSelected, setCurrentDateSelected] = useState("");
  const [prevCurrentDateSelected, setPrevCurrentDateSelected] = useState(null);
  const [allSlots, setAllSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const { userInfo, token } = useContext(AppContext);
  const [phonepe, setPhonepe] = useState(null);
  const [serviceData, setServiceData] = useState([]);

  const { createCommetChatUser } = useMakeCometChatProfile();

  const getAvailableSlots = async () => {
    try {
      // Fetch available slots from the backend API
      const response = await fetch(
        `${backend_url}/experts/get-available-slots/${username}`
      );

      if (response.ok) {
        const responseData = await response.json();
        setAllSlots(responseData?.slots);

        if (!prevCurrentDateSelected) {
          setCurrentDateSelected(responseData?.data?.slots[0]?.booking_day);
          setPrevCurrentDateSelected(responseData?.data?.slots[0]?.booking_day);
        }
      } else {
        // Handle non-successful response (e.g., show an error message)
        console.error("Failed to fetch available slots.");
      }
    } catch (e) {
      // Handle fetch error
      console.error("An error occurred while fetching available slots:", e);
      setAllSlots([]);
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, []);

  const handleBookSlot = (slotTime, currentDate) => {
    if (!userInfo) return;
    // here only spliting slotTime because we need that
    // slotTime = slotTime.split("-")[0].split(":");
    slotTime = slotTime.split("-");

    let data = {
      expert_username: username,
      booking_day: currentDate,
      f_time: slotTime[0],
      t_time: slotTime[1],
      booked_by_user: userInfo?.username,
      mobile: true,
    };

    fetch(`${backend_url}/experts/book-slot/${userInfo?.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        createCommetChatUser({
          username: userInfo.username,
          First_Name: userInfo.First_Name,
          last_name: userInfo.last_name,
          userpic_url: userInfo.userpic_url,
        });
        setPhonepe(res.phonepe);
        getAvailableSlots();
      })
      .catch((err) => {
        console.log("hello err", err);
      });
  };

  useEffect(() => {
    if (phonepe) {
      const openWebBrowser = async () => {
        await WebBrowser.openBrowserAsync(phonepe.url);
        setPhonepe(null);
      };
      openWebBrowser();
    }
  }, [phonepe]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    const slots = allSlots.find((slot) => slot.booking_day === date);
    setSelectedSlots(slots ? slots.available_slots : []);
  };

  useEffect(() => {
    if (allSlots.length > 0) {
      const firstSlot = allSlots[0];
      setSelectedDate(firstSlot.booking_day);
      setSelectedSlots(firstSlot.available_slots);
    }
  }, [allSlots]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(
          `${backend_url}/experts/get-expert-service/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data?.service) {
            setServiceData([data.service]);
          } else {
            setServiceData([]);
          }
        } else {
          console.error("Error fetching available slots");
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const SlotItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        gap: 10,
        display: "flex",

        marginEnd: 5,
      }}
    >
      {selectedDate === item.booking_day &&
        item.available_slots.map((slot, index) => {
          const startTime = `${slot.from[0]}:${slot.from[1]}`;
          const endTime = `${slot.to[0]}:${slot.to[1]}`;
          const slotTimeRange = `${startTime}-${endTime}`;

          return (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.slotCard,
                  {
                    backgroundColor:
                      selectedTime === slotTimeRange ? "#5d20d2" : "white",
                    color: selectedTime === slotTimeRange ? "white" : "black",
                  },
                ]}
                onPress={() => setSelectedTime(slotTimeRange)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedTime === slotTimeRange ? "white" : "black",
                  }}
                >
                  {convertTimeTo12HourFormat(startTime)}
                </Text>
                <Text
                  style={{
                    height: 15,
                    color: selectedTime === slotTimeRange ? "white" : "black",
                  }}
                >
                  {" "}
                  -{" "}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedTime === slotTimeRange ? "white" : "black",
                  }}
                >
                  {convertTimeTo12HourFormat(endTime)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );

  return (
    <View
      style={{
        width: screenWidth,
        backgroundColor: "white",
        borderColor: "#e0e0e0",
        borderWidth: 1,
      }}
    >
      {serviceData.map((slot, index) => (
        <Text
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginStart: 22,
            marginTop: 4,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Reserve {slot.duration} Minutes for ₹ {slot.price} !
        </Text>
      ))}
      <Text
        style={{ fontSize: 14, fontWeight: 600, marginStart: 22, marginTop: 4 }}
      >
        Pick a date
      </Text>
      <FlatList
        style={{
          width: "90%",
          padding: 10,
          marginStart: "auto",
          marginEnd: "auto",
        }}
        data={allSlots}
        keyExtractor={(slot, index) => index.toString()}
        pagingEnabled={true}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginTop: 20,
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            Slots not available
          </Text>
        )}
        renderItem={({ item, index }) => (
          <View
            style={{
              display: "flex",
              width: 100,
              height: 50,
              marginEnd: 5,
              color: "green",
            }}
          >
            <View style={styles.maincontainer}>
              <TouchableOpacity
                style={[
                  styles.slotCard,
                  {
                    backgroundColor:
                      selectedDate === item.booking_day ? "#5d20d2" : "white",
                  },
                ]}
                onPress={() => handleDateSelection(item.booking_day)}
              >
                <Text
                  style={[
                    styles.slotText,
                    {
                      color:
                        selectedDate === item.booking_day ? "white" : "black",
                    },
                  ]}
                >
                  {item.booking_day}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        horizontal={true}
      />

      <Text
        style={{ fontSize: 14, fontWeight: 600, marginStart: 22, marginTop: 4 }}
      >
        Pick a Time
      </Text>

      <FlatList
        style={{
          width: "90%",
          marginStart: "auto",
          marginEnd: "auto",
        }}
        horizontal={true}
        data={allSlots.filter((item) => item.booking_day === selectedDate)}
        keyExtractor={(slot, index) => index.toString()}
        renderItem={({ item }) => <SlotItem item={item} />}
      />

      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity
          disabled={currentDateSelected === "" || selectedTime === ""}
          onPress={() => {
            if (!userInfo) {
              navigation.navigate("Login");
            } else {
              handleBookSlot(selectedTime, selectedDate);
            }
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#e0e0e0",
            backgroundColor:
              currentDateSelected === "" || selectedTime === ""
                ? "#b8b7bb"
                : "#5d20d2",

            width: 250,
            paddingVertical: 10,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              textTransform: "none",
            }}
          >
            Book Slots
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  maincontainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  slotCard: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
    padding: 6,
  },

  slotText: {
    letterSpacing: 0.4,
    fontSize: 12,
  },
});

export default Slot;
