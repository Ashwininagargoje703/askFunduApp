import {
  FlatList,
  StyleSheet,
  Dimensions,
  Share,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { backend_url } from "../../https-common";
import SinglePost from "../components/SinglePost";
import Bottom from "./Bottom";

const SinglePostScreen = ({ route }) => {
  const { postId } = route.params;
  // console.log("jsdgsdj", postId);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSinglePost();
  }, [postId]);

  let fetchSinglePost = () => {
    fetch(`${backend_url}/post-by-postId/${postId}`)
      .then((res) => res.json())
      .then((d) => {
        // console.log("data from api", d.posts);
        setData(() => d.posts);
      });
  };

  const renderFooter = () => {
    // Show the loading indicator at the bottom only after the first page is loaded
    if (loading && firstPageLoaded) {
      return <ActivityIndicator size="large" color="blue" />;
    }
    return null;
  };

  const renderHeader = () => {
    // Show the loading indicator at the top one time if the first page is not loaded
    if (loading) {
      return <ActivityIndicator size="large" color="blue" />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <SinglePost item={item} />}
        keyExtractor={(item) => item._id}
        // onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader} // Render the loading indicator at the top (one time)
        ListFooterComponent={renderFooter} // Render the loading indicator at the bottom
      />
      <Bottom />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
  },
});

export default SinglePostScreen;
