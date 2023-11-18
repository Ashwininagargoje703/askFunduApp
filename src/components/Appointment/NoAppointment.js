import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  Share,
} from "react-native";
import { AppContext } from "../../context/AppContext";

const NoAppointment = ({ isExpert, unique_id }) => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AppContext);

  const createLinkFromFirebase = async (unique_id) => {
    try {
      let url =
        "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDuZ7Kux2hPr64Y_ABEgsHdMdufB4itPts";
      let payload = {
        dynamicLinkInfo: {
          domainUriPrefix: "https://askfundu123.page.link",
          link: `https://web.askfundu.com/rooms/${userInfo?.username}`,
          androidInfo: {
            androidPackageName: "com.askfundu",
          },
          iosInfo: {
            iosBundleId: "com.example.ios",
          },
        },
      };
      let d = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let dd = await d.json();
      return dd?.shortLink;
    } catch (e) {
      console.log("something went wrong");
    }
  };

  const shareContent = async (link, title) => {
    let newlink = await createLinkFromFirebase(link);
    try {
      // let shareLink = await buildLink(link);
      const result = await Share.share({
        message: `https://web.askfundu.com/rooms/${userInfo?.username}`,
        url: "link",
        title: "title",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // console.log("result shared", result);
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.log("Error sharing:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: "https://i.ibb.co/h2WCWjS/Whats-App-Image-2023-07-22-at-6-16-55-PM.jpg",
          }}
        />
      </View>
      <View style={styles.textContainer}>
        {isExpert ? (
          <>
            <Text style={styles.title}>Share your page</Text>
            <Text style={styles.subtitle}>
              A new booking might just be around the corner,
              {"\n"} share your page today!
            </Text>

            <TouchableOpacity
              style={styles.bookSlotsButton}
              onPress={() =>
                shareContent(`https://web.askfundu.com/rooms/${unique_id}`)
              }
            >
              <Text style={styles.bookSlotsButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Book Chats With Our Experts</Text>
            {!isExpert ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Rooms");
                }}
                style={styles.bookSlotsButton}
              >
                <Text style={styles.bookSlotsButtonText}>Book Chats</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    letterSpacing: 0.4,
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  bookSlotsButton: {
    backgroundColor: "#5D20D2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  bookSlotsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NoAppointment;
