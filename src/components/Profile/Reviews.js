import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
// Make sure to import your StarRating component
import { formatDate } from "../../common";
import ReviewRating from "./StarRatings";
import { backend_url } from "../../../https-common";

export default function AllReviews({ route, username }) {
  const [data, setData] = useState([]);
  //   const { username } = route.params;

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${backend_url}/experts/get-expert-reviews-by-username/ashwininagargoje`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("batao reviews1", data);

        setData(data?.allReviews?.reviews);
        console.log("batao reviews", data?.allReviews?.reviews);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <View>
      {data?.length > 0 ? (
        data.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.userContainer}>
              <Image
                style={styles.avatar}
                source={{ uri: item?.userDetails?.userpic_url }}
              />
              <Text style={styles.username}>
                {item?.userDetails?.First_Name +
                  " " +
                  item?.userDetails?.last_name}
              </Text>
            </View>
            <View style={styles.reviewDetails}>
              <Text style={styles.reviewText}>
                <Text style={styles.reviewLabel}>Rating: </Text>
                <ReviewRating rating={item?.rating} />
              </Text>
              <Text style={styles.reviewText}>
                <Text style={styles.reviewLabel}>Comment: </Text>
                {item?.comment}
              </Text>
              <Text style={styles.reviewText}>
                <Text style={styles.reviewLabel}>Reviewed At: </Text>
                {formatDate(item?.reviewed_at)}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noReviewsText}>Reviews not available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#D8D1E3",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#D8D1E3",
    borderRadius: 20,
  },
  username: {
    fontWeight: "600",
    marginLeft: 8,
    marginTop: 4,
  },
  reviewDetails: {
    marginLeft: 7,
  },
  reviewText: {
    letterSpacing: 0.4,
    fontSize: 14,
    marginBottom: 4,
  },
  reviewLabel: {
    fontWeight: "bold",
  },
  noReviewsText: {
    fontSize: 14,
    fontWeight: 600,
  },
});
