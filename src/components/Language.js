import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  PaperProvider,
  Text,
  RadioButton,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Language = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const hideDialog = () => setVisible(false);
  const { i18n } = useTranslation();

  const handleDone = () => {
    navigation.navigate("NewsScreen");
  };

  const handleLanguageChange = async (value) => {
    let lng = "en";
    if (value === "english") {
      lng = "en";
    } else if (value === "hindi") {
      lng = "hi";
    }
    await AsyncStorage.setItem("selectedLanguage", lng); // Save selected language
    console.log("Selected Language saved:", lng); // Log saved language
    i18n.changeLanguage(lng);
    setSelectedLanguage(value);
  };

  React.useEffect(() => {
    const loadSelectedLanguage = async () => {
      const selectedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (selectedLanguage) {
        // console.log("Selected Language loaded:", selectedLanguage); // Log loaded language
        setSelectedLanguage(selectedLanguage === "hi" ? "hindi" : "english");
        i18n.changeLanguage(selectedLanguage);
      }
    };
    loadSelectedLanguage();
    setVisible(true);
  }, []);

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={visible} style={{ backgroundColor: "white" }}>
          <Dialog.Content>
            <View style={styles.container}>
              <View style={styles.content}>
                <Text style={styles.text}>हिंदी</Text>
                <RadioButton
                  value="hindi"
                  status={
                    selectedLanguage === "hindi" ? "checked" : "unchecked"
                  }
                  onPress={() => handleLanguageChange("hindi")}
                />
              </View>

              <View style={styles.content}>
                <Text style={styles.text}>English</Text>
                <RadioButton
                  value="english"
                  status={
                    selectedLanguage === "english" ? "checked" : "unchecked"
                  }
                  onPress={() => handleLanguageChange("english")}
                />
              </View>
            </View>
          </Dialog.Content>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    marginTop: 2,
    fontWeight: "600",
    color: "black",
  },
  doneButton: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#5d20d2",
    width: 70,
    padding: 7,
    borderRadius: 20,
    marginBottom: 10,
  },
  doneButtonText: {
    color: "white",
  },
});

export default Language;
