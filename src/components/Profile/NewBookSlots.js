import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { backend_url } from "../../../https-common";

const NewBooksSlots = ({ username }) => {
  const [serviceData, setServiceData] = useState([]);

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

  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        {serviceData.map((slot, index) => (
          <View
            style={styles.container}
            key={`service-index-${
              index * Math.floor(Math.random() * 100) + index
            }`}
          >
            <Image
              source={{
                uri: "https://i.ibb.co/r7kPGm6/Whats-App-Image-2023-08-19-at-1-37-23-PM.jpg",
              }}
              style={styles.image}
            />
            <Text style={styles.title}>{slot.title}</Text>
            <Text style={styles.sessionText}>
              <Text style={styles.boldText}>Session charge:</Text> {slot.price}{" "}
              ₹ / {slot.duration} Min
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 5,
    marginTop: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#313342",
  },
  sessionText: {
    marginTop: 8,
    color: "#5d20d2",
  },
  boldText: {
    fontWeight: "bold",
    color: "#313342",
  },
});

export default NewBooksSlots;
