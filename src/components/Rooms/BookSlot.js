import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Slot from "./slot";
import { backend_url } from "../../../https-common";
import * as WebBrowser from "expo-web-browser";
import { AppContext } from "../../context/AppContext";
import { AntDesign as AntDesignIcon, FontAwesome } from "@expo/vector-icons";

const BookSlot = ({ username }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentDateSelected, setCurrentDateSelected] = useState();
  const [prevCurrentDateSelected, setPrevCurrentDateSelected] = useState(null);
  const [phonepe, setPhonepe] = useState(null);
  const { userInfo, token } = useContext(AppContext);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleBookSlot = (slotTime, currentDate) => {
    if (!userInfo) return;
    // console.log(currentDate, "currentdate here");
    // this will create the data for booking slot
    let data = {
      expert_username: username,
      booking_day: currentDate,
      f_hr: slotTime[0],
      f_min: slotTime[1],
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
        // console.log("is it comming", res);
        setPhonepe(res.phonepe);
        //   createCommetChatUser(user);
        getExpertAvailableSlots();
      })
      .catch((err) => {
        console.log("hello err", err);
      });
  };

  useEffect(() => {
    if (phonepe) {
      console.log(phonepe, "phonepe");
      const openWebBrowser = async () => {
        await Linking.openURL(phonepe.url).catch((err) =>
          console.error("An error occurred: ", err)
        );
        setPhonepe(null);
      };
      openWebBrowser();
    }
  }, [phonepe]);

  // console.log("username", username);
  const getExpertAvailableSlots = async () => {
    try {
      let res = await fetch(
        `${backend_url}/experts/get-available-slots/${username}`
      );
      res = await res.json();
      setAvailableSlots(res.slots);

      if (prevCurrentDateSelected) {
        return;
      }
      setCurrentDateSelected(res?.slots[0]?.booking_day);
      setPrevCurrentDateSelected(res?.slots[0]?.booking_day);
    } catch (e) {
      console.log("not able to fetch expert available slots", e.message);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      getExpertAvailableSlots();
    }
  }, [isModalVisible]);
  const availableDates = availableSlots
    .map((slot) => {
      if (slot?.available_slots.length > 0) return slot.booking_day;
    })
    .filter((item) => item);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.followButton} onPress={toggleModal}>
        <Text style={styles.followButtonText}>Book Slot</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <AntDesignIcon
                name="close"
                size={20}
                color="black"
                onPress={toggleModal}
              />
            </TouchableOpacity>
            <Text style={{ fontWeight: 600, marginBottom: 5 }}>Book Chats</Text>
            <Slot username={username} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 20,
  },
  followButton: {
    width: 70,
    height: 30,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5d20d2",
    backgroundColor: "#5d20d2",
    marginTop: 8,
  },
  followButtonText: {
    fontSize: 12,
    color: "white",
  },
});

export default BookSlot;
