import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import LanguageFilter from "./Language";

const VerticalTabs = ({
  checkedValues,
  setCheckedValues,
  languages,
  selectLanguages,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    "Item One",
    "Item Two",
    "Item Three",
    "Item Four",
    "Item Five",
    "Item Six",
    "Item Seven",
  ];

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <ScrollView style={{ backgroundColor: "#f0f0f0" }}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabChange(index)}
            style={{
              padding: 16,
              backgroundColor: activeTab === index ? "#ccc" : "transparent",
            }}
          >
            <Text>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{ flex: 1, backgroundColor: "#fff", padding: 16, width: "70%" }}
      >
        {activeTab === 0 ? (
          <LanguageFilter
            checkedValues={checkedValues}
            setCheckedValues={setCheckedValues}
            languages={languages}
            selectLanguages={selectLanguages}
          />
        ) : (
          <Text>{tabs[activeTab]}</Text>
        )}
      </View>
    </View>
  );
};

export default VerticalTabs;
