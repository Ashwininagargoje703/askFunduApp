import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const convertToYYYYMMDD = (dateDDMMYYYY) => {
  if (!dateDDMMYYYY) return;
  const [day, month, year] = dateDDMMYYYY.split("-");
  return `${year}-${month}-${day}`;
};

const MyCalendar = ({
  currentDateSelected,
  setCurrentDateSelected,
  availableSlotsDates,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    convertToYYYYMMDD(currentDateSelected)
  );

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setCurrentDateSelected(convertToYYYYMMDD(day.dateString));
  };

  const markedDates = {};
  if (Array.isArray(availableSlotsDates)) {
    availableSlotsDates.forEach((date) => {
      // console.log(date);
      date = convertToYYYYMMDD(date);
      markedDates[date] = { selected: true, selectedColor: "#c79ffd" };
    });
  }

  const customDayTextStyle = (date) => {
    const formattedDate = convertToYYYYMMDD(date.dateString);
    return {
      color: availableSlotsDates.includes(formattedDate) ? "red" : "gray",
      fontWeight: "bold",
    };
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: "blue" },
        }}
        style={{
          borderWidth: 1,
          borderColor: "#e0e0e0",
          borderRadius: 4,
          minWidth: 330,
        }}
        theme={{
          dayTextColor: "lightgray",
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default MyCalendar;
