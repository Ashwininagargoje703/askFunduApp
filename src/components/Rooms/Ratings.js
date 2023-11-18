import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StarRating = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = maxStars - fullStars - halfStars;

  return (
    <View style={styles.starRatingContainer}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={index} name="star" size={16} color="#5d20d2" />
      ))}
      {halfStars > 0 && <Icon name="star-half-o" size={16} color="#5d20d2" />}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={index} name="star-o" size={16} color="#5d20d2" />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});

export default StarRating;
