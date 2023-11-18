import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { ActivityIndicator, Button, RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Snackbar } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import { backend_url } from "../../https-common";

const Intrest = () => {
  const [searchSector, setSearchSector] = useState([]);
  const [selectedSearchedSector, setSelectedSearchedSector] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true); // New state variable for loading
  const [interest, setInterest] = useState([]); // Updated to an array
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userInterests, setUserInterests] = useState([]);
  const [allSectors, setAllSectors] = useState([]); // New state variable for all sectors
  const [filteredResults, setFilteredResults] = useState([]); // New state variable for filtered results

  const { userInfo } = useContext(AppContext);

  const navigation = useNavigation();

  useEffect(() => {
    handleSearchSector();
  }, []);

  const handleSelectSearchedSector = (id, item) => {
    if (userInfo) {
      setSelectedSearchedSector((prevSelectedSectors) => {
        if (prevSelectedSectors.includes(item.Sector)) {
          return prevSelectedSectors.filter((sector) => sector !== item.Sector);
        } else {
          setInterest((prevInterest) => [...prevInterest, item.Sector]);
          return [...prevSelectedSectors, item.Sector];
        }
      });
    } else {
      // User is not logged in, redirect to the login screen
      navigation.navigate("Login");
    }
  };

  const handleSearchSector = useCallback(async () => {
    try {
      const response = await fetch(`${backend_url}/stocks/get-all-sectors`);
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      // console.log("Received data:", data);

      let filteredData = data.stocks;
      if (data.stocks && data.stocks.length > 0) {
        filteredData = data.stocks.filter(
          (item) => item.Sector !== null && item.Sector !== ""
        );
      }
      setAllSectors(filteredData || []);

      const filteredResults = filteredData.filter((sector) =>
        sector.Sector.toLowerCase().includes(
          (inputText && inputText.toLowerCase()) || ""
        )
      );
      setFilteredResults(filteredResults);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
      setLoading(false);
    }
  }, [inputText]);

  const handleDone = async () => {
    if (!userInfo || !userInfo.username) {
      setSnackbarMessage("Please log in to save interests!");
      setSnackbarVisible(true);
      return;
    }

    if (selectedSearchedSector.length === 0) {
      setSnackbarMessage("Please select at least one sector!");
      setSnackbarVisible(true);
      return;
    }

    try {
      const requestData = {
        username: userInfo.username,
        interests: selectedSearchedSector,
      };

      const response = await fetch(
        `${backend_url}/users/update-user-interest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error("Error saving interests");
      }
      setSnackbarMessage("Interests saved successfully!");
      setSnackbarVisible(true);
      fetchUserInterests();
    } catch (error) {
      console.error("Error saving interests:", error);
    }

    setInputText("");
    setFilteredResults(allSectors);
    setSelectedSearchedSector([]);
    setLoading(true);
    handleSearchSector();
  };

  useEffect(() => {
    if (userInfo !== null) {
      fetchUserInterests();
    }
  }, [userInfo]);

  const fetchUserInterests = async () => {
    try {
      // console.log(userInfo);
      const response = await fetch(
        `${backend_url}/users/get-user-interests/${userInfo.username}`
      );
      const data = await response.json();
      setUserInterests(data.stocks || []);
      // console.log(data, "data");
    } catch (error) {
      console.error(error);
    }
  };

  const screenHeight = Dimensions.get("window").height;
  const containerHeight = screenHeight - 170;
  TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
  };

  return (
    <View style={styles.container}>
      <View style={{ height: containerHeight }}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            onChangeText={setInputText}
            onSubmitEditing={handleSearchSector}
            value={inputText}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="medium" color="blue" />
        ) : (
          <View>
            <FlatList
              data={filteredResults} // Update to use filteredResults
              renderItem={({ item }) => {
                const isUserInterest = userInterests.some(
                  (interest) => interest.Sector === item.Sector
                );
                // console.log("isUserInterest:", isUserInterest);
                return (
                  <View
                    key={item._id}
                    style={
                      isUserInterest
                        ? styles.containerIntrestPink
                        : styles.containerStocks
                    }
                  >
                    <Text style={styles.name}>{item.Sector}</Text>
                    {isUserInterest ? (
                      <RadioButton
                        value={item.Sector}
                        status="checked"
                        onPress={() => {
                          // Handle removing interest here if needed
                        }}
                      />
                    ) : (
                      <RadioButton
                        value={item.Sector}
                        status={
                          selectedSearchedSector.includes(item.Sector)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => {
                          handleSelectSearchedSector(item._id, item);
                        }}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
  },

  containerStocks: {
    height: 35,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7f6f9",
    borderRadius: 8,
    shadowColor: "#D8D1E3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 4,
  },

  containerIntrestPink: {
    height: 35,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e7d2fa",
    borderRadius: 8,
    shadowColor: "#D8D1E3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 8,
  },
  name: {
    textAlign: "center",
    alignSelf: "center",
    fontWeight: 600,
    marginLeft: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  doneButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    backgroundColor: "#5d20d2",
    width: 100,
    padding: 7,
    borderRadius: 8,
    marginTop: 10,
  },
  doneButtonText: {
    color: "white",
  },
  snackbar: {
    backgroundColor: "#5d20d2",
    color: "white", // Customize the background color here
  },
});

export default Intrest;
