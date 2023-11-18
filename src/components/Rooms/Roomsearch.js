import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Search = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchText(""); // Clear the searchText when closing the search box
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchText);
    }, 500);

    // Cleanup the timer on every rerender before executing the effect again
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View>
      {isSearchOpen ? (
        <View style={styles.container}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={() => onSearch(searchText)} // Trigger search on submit
          />
          <TouchableOpacity onPress={toggleSearch}>
            <Icon name="close" size={24} color="#898989" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.searchIcon}>
          <TouchableOpacity onPress={toggleSearch}>
            <Image
              source={{
                uri: "https://i.ibb.co/3Yd51bJ/Whats-App-Image-2023-09-05-at-3-59-37-PM-removebg-preview.png",
              }}
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    // marginLeft: 10,
    // marginRight: 120,
    marginTop: 10,
    marginBottom: 10,
  },

  searchIcon: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginRight: 10,
    marginBottom: -10,
  },

  searchBox: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#898989",
  },

  logo: {
    width: 40,
    height: 50,
    resizeMode: "contain",
  },
});

export default Search;
