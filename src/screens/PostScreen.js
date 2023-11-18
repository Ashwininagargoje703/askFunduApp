import {
  FlatList,
  StyleSheet,
  Dimensions,
  Share,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { backend_url } from "../../https-common";
import { AppContext } from "../context/AppContext";
import SocialPost from "../components/SocialPost";
import Bottom from "./Bottom";
import AllRoutes, { CustomHeader } from "./AllRoutes";

const WINDOW_HEIGHT = Dimensions.get("window").height - 60;

const PostScreen = () => {
  const {
    posts,
    setPosts,
    setLoading,
    page,
    setPage,
    allDataLoaded,
    setAllDataLoaded,
    firstPageLoaded,
    setFirstPageLoaded,
    fetchPosts,
    loading,
  } = useContext(AppContext);

  const { userInfo, getUserLikedDislikedPosts, userLikedDislikedPost } =
    useContext(AppContext);

  useEffect(() => {
    getUserLikedDislikedPosts();
  }, []);

  const handleEndReached = () => {
    if (!loading && !allDataLoaded) {
      // Increment the page number to load the next set of posts
      setPage((prevPage) => prevPage + 1);
    }
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
    if (loading && !firstPageLoaded) {
      return <ActivityIndicator size="large" color="blue" />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <SocialPost item={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={handleEndReached}
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

export default PostScreen;
