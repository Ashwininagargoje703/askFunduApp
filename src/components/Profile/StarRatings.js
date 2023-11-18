import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating"; // Make sure to import the StarRating component

export default function ReviewRating() {
  const [value, setValue] = useState(2);

  return (
    <View style={styles.container}>
      <StarRating
        disabled={false}
        maxStars={5}
        rating={value}
        selectedStar={(rating) => setValue(rating)}
        fullStarColor="#5D20D2"
        starSize={18}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
});
