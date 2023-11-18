import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import NewsScreen from "../../screens/NewsScreen";
import UserPostScreen from "../../screens/UserPostScreen";
import AllReviews from "./Reviews";

function CustomTabBar({ tabs, activeTab, onPressTab }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
          onPress={() => onPressTab(index)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === index && styles.activeTabLabel,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function UserPostTab({ username }) {
  const tabs = ["Post", "Reviews"];
  const [activeTab, setActiveTab] = useState(0);

  const renderScreen = () => {
    if (activeTab === 0) {
      return <UserPostScreen username={username} />;
    } else if (activeTab === 1) {
      return <AllReviews />;
    }
  };

  return (
    <View style={styles.container}>
      <CustomTabBar
        tabs={tabs}
        activeTab={activeTab}
        onPressTab={setActiveTab}
      />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#000",
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderBottomColor: "#D8D1E3",
    height: 40,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTabItem: {
    borderColor: "blue",
  },
  tabLabel: {
    fontSize: 16,
  },
  activeTabLabel: {
    color: "blue",
    fontWeight: "bold",
  },
});

export default UserPostTab;
