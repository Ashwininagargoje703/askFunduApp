import {
  FlatList,
  StyleSheet,
  Dimensions,
  Share,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { backend_url } from "../../https-common";
import SocialPost from "../components/SocialPost";
import { Text } from "react-native";

const WINDOW_HEIGHT = Dimensions.get("window").height - 60;

const UserPostScreen = ({ username }) => {
  // const { username } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await fetch(`${backend_url}/posts-by-user/${username}`);
      const result = await response.json();
      setData(result.posts);
      // console.log(result.posts, "posts");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const renderHeader = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="blue" />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {data.length === 0 ? ( // Check if data array is empty
        <Text
          style={{
            fontSize: 16,
            padding: 40,
            fontWeight: 600,
            textAlign: "center", // Corrected typo here
            alignItems: "center", // Corrected typo here
          }}
        >
          No posts available
        </Text>
      ) : (
        // Display message when no posts are available
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <SocialPost item={item} />}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderHeader}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
  },
});

export default UserPostScreen;
