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
import { AppContext } from "../context/AppContext";
import RoomsList from "../components/Rooms/RoomsList";
import Search from "../components/Rooms/Roomsearch";
import Bottom from "./Bottom";
import FilterButton from "../components/Rooms/Filter/FilterButton";

const WINDOW_HEIGHT = Dimensions.get("window").height - 60;

const RoomScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [firstPageLoaded, setFirstPageLoaded] = useState(false);
  const [checkedValues, setCheckedValues] = useState({});
  const [checkedAreaFocusValues, setCheckedAreaFocusValues] = useState({});
  const [checkedExpertiesValues, setCheckedExpertiesValues] = useState({});
  const [languages, selectLanguages] = useState([]);
  const [areaOfFocus, setAreaOfFocus] = useState([]);
  const [selectedRating, setSelectedRating] = useState("All");
  const [isSebiRegistered, setIsSebiRegistered] = useState(undefined);
  const [isCertified, setIsCertified] = useState(undefined);

  useEffect(() => {
    fetchSinglePost();
  }, [searchText]);
  let fetchSinglePost = () => {
    fetch(`${backend_url}/experts/get-experts?page=${1}&search=${searchText}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d.experts);
        setFirstPageLoaded(true); // Set the firstPageLoaded to true
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
      <Search onSearch={setSearchText} />

      <FlatList
        data={data}
        renderItem={({ item }) => <RoomsList item={item} />}
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

export default RoomScreen;
