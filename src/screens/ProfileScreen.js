import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { backend_url } from "../../https-common";
import Bottom from "./Bottom";
import ProfileExpert from "../components/Profile/ExpertProfile";
const PofileScreen = ({ route }) => {
  const { username } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page

  useEffect(() => {
    fetchExpertProfile();
  }, [username, page]); // Trigger fetch when username or page changes

  let fetchExpertProfile = useCallback(() => {
    if (loading) return; // Prevent fetching if already loading
    setLoading(true);

    fetch(`${backend_url}/experts/get-expert-by-id/${username}`)
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData?.experts);
        // setPage((prevPage) => prevPage + 1); // Move to the next page
        setLoading(false);
      })
      .catch((error) => {
        console.error("API fetch error:", error);
        setLoading(false);
      });
  }, [loading, username]);

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="blue" />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={({ item: expert }) => {
          // console.log("Expert _id:", expert._id);
          return <ProfileExpert expert={expert} />;
        }}
        keyExtractor={(expert) => expert._id}
        onEndReached={fetchExpertProfile} // Fetch more data when reaching the end
        onEndReachedThreshold={0.1}
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

export default PofileScreen;
