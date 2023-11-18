import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Share,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Snackbar } from "react-native-paper";
import { backend_url } from "../../https-common";
// import { useNavigation } from "@react-navigation/native";
// import dynamicLinks from "@react-native-firebase/dynamic-links";

// const WINDOW_HEIGHT = Math.ceil(Dimensions.get("window").height) - 55;
const WINDOW_HEIGHT = Dimensions.get("window").height - 50;

const NewsCard = ({ item, index, visibleNewsIndex }) => {
  const {
    handleSetUserNewsInteraction,
    userInfo,
    addSavedNews,
    removeSavedNews,
    savedNews,
    setUserNewsTimeInteraction,
    userNewsTimeInteraction,
  } = useContext(AppContext);
  // const currentTime = userRef(1);
  const navigation = useNavigation();
  const summaryFontSize = WINDOW_HEIGHT >= 800 ? 16 : 14;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [timeSpent, setTimeSpent] = useState(0);
  const timeCap = useRef(0);

  // Ref to hold the interval ID for the timer
  const intervalIdRef = useRef(null);
  useEffect(() => {
    startTimer();
    return () => {
      handleCardUnmount();
    };
  }, []);

  const startTimer = () => {
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(() => {
        timeCap.current += 1;
        setTimeSpent((prevTime) => prevTime + 1);
      }, 1000);
    }
  };
  useEffect(() => {
    const postNewsSpentTime = async () => {
      let timeSpentArr = userNewsTimeInteraction;
      try {
        await fetch(`${backend_url}/news/save-news-screen-time`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userInfo?.id, timeSpentArr }),
        });
      } catch (error) {
        console.log(error, "somethign wrong went");
      }
      setUserNewsTimeInteraction([]);
    };
    if (userInfo && userInfo.username && index != 0 && index % 9 == 0) {
      // postNewsSpentTime();
    }
  }, [index]);

  const pauseTimer = () => {
    if (intervalIdRef.current) {
      setUserNewsTimeInteraction((prev) => {
        let sameNews = prev.filter((news) => news.newsId == item._id);
        let notSameNews = prev.filter((news) => news.newsId != item._id);
        if (sameNews.length > 0) {
          if (sameNews[0].time < timeCap.current) {
            {
              return [
                ...notSameNews,
                {
                  newsId: sameNews[0].newsId,
                  time: timeCap.current,
                },
              ];
            }
          } else {
            return notSameNews;
          }
        } else {
          return [
            ...notSameNews,
            {
              newsId: item._id,
              time: timeCap.current,
            },
          ];
        }
      });

      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const handleCardUnmount = () => {
    pauseTimer();
    handleSetUserNewsInteraction(item._id, timeCap.current);
  };

  const createLinkFromFirebase = async (id) => {
    try {
      let url =
        "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDuZ7Kux2hPr64Y_ABEgsHdMdufB4itPts";
      let payload = {
        dynamicLinkInfo: {
          domainUriPrefix: "https://askfundu123.page.link",
          link: `https://web.askfundu.com/news/${id}`,
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

  const getButtonStyle = () => {
    if (item?.Sentiment === "Positive" || item?.Sentiment === "सकारात्मक") {
      return [styles.button, styles.positive];
    } else if (
      item?.Sentiment === "Negative" ||
      item?.Sentiment === "नकारात्मक"
    ) {
      return [styles.button, styles.negative];
    } else if (item?.Sentiment === "Neutral" || item?.Sentiment === "तटस्थ") {
      return [styles.button, styles.neutral];
    }
    return styles.button;
  };

  const shareContent = async (link, title) => {
    let newlink = await createLinkFromFirebase(link);
    try {
      // let shareLink = await buildLink(link);
      const result = await Share.share({
        message: newlink,
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

  Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };

  const checkIfSaved = () => {
    return savedNews.some((news) => news._id === item._id);
  };

  const handleStarPress = async () => {
    try {
      if (!userInfo) {
        // User is not logged in, navigate to login page
        navigation.navigate("Login");
      }

      if (checkIfSaved()) {
        // News is already saved, so remove it
        await removeSavedNews(item._id);
        setSnackbarMessage("News removed from saved items.");
      } else {
        // News is not saved, so add it
        await addSavedNews(item._id);
        setSnackbarMessage("News added to saved items.");
      }
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error while saving/removing news:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: item.Image_link }}
        resizeMode="cover"
        // defaultSource={require("../assets/askfunduLogo.png")}
      />
      <View style={styles.contentContainer}>
        <Text>{new Date(item.Created_at).toLocaleDateString()}</Text>
        {item?.Sentiment && (
          <TouchableOpacity style={getButtonStyle()}>
            <Text style={styles.buttonText}>{item.Sentiment}</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* <Text>Time Spent: {timeSpent} seconds</Text> */}
      <View style={styles.contentContainer}>
        <Text>
          Published by:{" "}
          <Text
            style={{ textDecorationLine: "underline", color: "#5d20d2" }}
            onPress={() => {
              if (item?.Link) {
                Linking.openURL(item.Link).catch((error) =>
                  console.error("Error opening URL:", error)
                );
              }
            }}
          >
            {item?.Domain}
          </Text>
        </Text>
        <View style={styles.sharesave}>
          <TouchableOpacity
            onPress={() =>
              shareContent(
                item._id,
                // `https://web.askfundu.com/news/${item._id}`,
                item.Headline
              )
            }
          >
            <Feather name="send" size={20} color="black" />
          </TouchableOpacity>

          {checkIfSaved() ? (
            <TouchableOpacity onPress={handleStarPress}>
              <FontAwesome name="star" size={22} color="#5d20d2" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleStarPress}>
              <FontAwesome name="star-o" size={22} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headline}>{item.Headline}</Text>
        {item.Summary && item.Summary.length > 0 ? (
          item.Summary.slice(0, 4).map((summaryItem, index) => (
            <View style={styles.bulletContainer} key={index}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={[styles.summary, { fontSize: summaryFontSize }]}>
                {summaryItem}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.summary, { fontSize: summaryFontSize }]}>
            {item.Summary}
          </Text>
        )}
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    // paddingTop: 20,
    paddingHorizontal: 16,
    height: WINDOW_HEIGHT,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // borderColor: "red",
    // borderWidth: 1,
  },
  // card: {
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   paddingVertical: 16,
  // },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 10,
  },
  bulletContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  bulletPoint: {
    fontSize: 24,
    fontWeight: 600,
    marginRight: 6,
    marginTop: -6,
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  summary: {
    fontFamily: "Roboto",
    color: "black",
    textAlign: "left",
    marginRight: 10,
    lineHeight: 22,
  },
  contentContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 2,
  },
  button: {
    backgroundColor: "#2196f3", // Button background color
    borderRadius: 5,
    width: 60,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white", // Button text color
    fontSize: 12,
    fontWeight: "bold",
  },
  positive: {
    backgroundColor: "#08a745", // Positive sentiment color
  },
  negative: {
    backgroundColor: "#cc3d3f", // Negative sentiment color
  },
  neutral: {
    backgroundColor: "#f8c361", // Neutral sentiment color
  },
  sharesave: {
    flexDirection: "row",
    gap: 20,
  },
  snackbar: {
    backgroundColor: "#5d20d2",
    color: "white",
    marginTop: -90,
    zIndex: 99999,
    // Customize the background color here
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
});

export default NewsCard;
