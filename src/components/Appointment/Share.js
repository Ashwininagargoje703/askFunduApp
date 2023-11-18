import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Share from "react-native-share";

export default function ShareProfile() {
  const shareWhatsApp = async () => {
    try {
      const shareOptions = {
        title: "Share via WhatsApp",
        message: "Check out my profile:",
        url: "https://web.askfundu.com/rooms/ashwininagargoje", // Replace with your actual URL
        social: Share.Social.WHATSAPP,
      };

      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const shareTelegram = async () => {
    try {
      const shareOptions = {
        title: "Share via Telegram",
        message: "Check out my profile:",
        url: "https://web.askfundu.com/rooms/your-username", // Replace with your actual URL
        social: Share.Social.TELEGRAM,
      };

      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={shareWhatsApp}>
        <Text style={styles.buttonText}>Share via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={shareTelegram}>
        <Text style={styles.buttonText}>Share via Telegram</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
