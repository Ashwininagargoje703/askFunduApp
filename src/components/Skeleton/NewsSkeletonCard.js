import { memo } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";

const SkeletonNewsCard = memo(() => {
  return (
    <View style={[styles.container, styles.skeletonContainer]}>
      <View style={styles.skeletonImage}></View>
      <View style={styles.skeletonContentContainer}>
        <View style={styles.skeletonDate}></View>
        <View style={styles.skeletonSentiment}></View>
      </View>
      <View style={styles.skeletonTimeSpent}></View>
      <View style={styles.skeletonContentContainer}>
        <View style={styles.skeletonPublishedBy}></View>
        <View style={styles.skeletonSharesave}></View>
      </View>
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonHeadline}></View>
        <View style={styles.skeletonSummary}></View>
        <View style={styles.skeletonSummary}></View>
        <View style={styles.skeletonSummary}></View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // ... Your existing styles

  skeletonContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },

  // Skeleton styles
  skeletonImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd", // Placeholder color
    marginBottom: 10,
    borderRadius: 5,
  },
  skeletonContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 2,
  },
  skeletonDate: {
    width: 100,
    height: 14,
    backgroundColor: "#ddd", // Placeholder color
  },
  skeletonSentiment: {
    width: 60,
    height: 18,
    backgroundColor: "#ddd", // Placeholder color
  },
  skeletonTimeSpent: {
    width: 100,
    height: 16,
    backgroundColor: "#ddd", // Placeholder color
    marginBottom: 5,
  },
  skeletonPublishedBy: {
    width: 150,
    height: 16,
    backgroundColor: "#ddd", // Placeholder color
  },
  skeletonSharesave: {
    flexDirection: "row",
    gap: 20,
  },
  skeletonTextContainer: {
    marginTop: 10,
  },
  skeletonHeadline: {
    width: "60%",
    height: 18,
    backgroundColor: "#ddd", // Placeholder color
    marginBottom: 8,
  },
  skeletonSummary: {
    width: "100%",
    height: 16,
    backgroundColor: "#ddd", // Placeholder color
    marginBottom: 4,
  },
});

export default SkeletonNewsCard;
