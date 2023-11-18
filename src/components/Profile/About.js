import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  text2: {
    fontSize: 16,
    fontWeight: 700,
  },
});

const About = ({ expert }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text2}>About</Text>
      <Text style={styles.text}>{expert?.about}</Text>
    </View>
  );
};

export default About;
