import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";

const UpcomingCardSingleItem = ({
  item,
  isUserExpert,
  handleSetDetails,
  slotData,
}) => {
  const handleClicked = (item) => {
    value = {
      username: !isUserExpert ? item.expert_username : item.booked_by_user,
      timing: `${item.timing.from.join(":")}-${item.timing.to.join(":")}`,
      date: !isUserExpert ? slotData.booked_date : slotData.booking_day,
    };
    handleSetDetails(value);
  };

  const checkTimings = (timeStr) => {
    let date = isUserExpert ? slotData.booking_day : slotData.booked_date;
    let [day, month, year] = date.split("-");
    const inputTime = new Date(`${year}-${month}-${day}T${timeStr}:00`);
    const currentTime = new Date();

    const timeDifference = inputTime - currentTime;

    return timeDifference <= 900000;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Avatar.Image
          size={35}
          style={{ marginTop: 4.5 }}
          source={{
            uri: item?.userDetails?.userpic_url,
          }}
        />
        <View style={styles.details}>
          <Text style={styles.name}>
            {`${item.userDetails?.First_Name} ${item.userDetails?.last_name}`}
          </Text>
          <Text style={styles.role}>
            ({!isUserExpert ? "Expert" : "Booked By"})
          </Text>
          <Text style={styles.timing}>
            Timings: {item.timing?.from.join(":")} - {item.timing?.to.join(":")}
          </Text>
          <Text style={styles.bookedDate}>
            Booked Date:{" "}
            {isUserExpert ? slotData.booking_day : slotData.booked_date}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={checkTimings(item.timing?.from.join(":")) ? false : true}
          onPress={() => handleClicked(item)}
          style={
            checkTimings(item.timing?.from.join(":"))
              ? styles.button
              : { ...styles.button, backgroundColor: "gray" }
          }
        >
          <Text style={styles.buttonText}>Join Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#5D20D2",
    paddingHorizontal: 20,
    width: 100,
    height: 30,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
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

export default UpcomingCardSingleItem;
