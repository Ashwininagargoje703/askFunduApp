import React, { useContext, useEffect, useState } from "react";

import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  capitalFirstLetter,
  checkFollow,
  formatDate,
  time_difference,
} from "../common";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import { backend_url } from "../../https-common";
import { Alert } from "react-native";
import { Dimensions } from "react-native";

const SocialPost = ({ item }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentUpvoteData, setCurrentUpvoteData] = useState([]);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImage, setFullImage] = useState("");
  const [currentDownvoteData, setCurrentDownvoteData] = useState([]);
  const {
    createUpVote,
    createDownVote,
    handleFollow,
    myFollowings,
    userInfo,
    getUserLikedDislikedPosts,
    userLikedDislikedPost,
  } = useContext(AppContext);
  const navigation = useNavigation();

  // const handleToggleComments = () => {
  //   setShowComments((prevShowComments) => !prevShowComments);
  // };
  const getPostUpvotesByPostId = async () => {
    // console.log(item._id);
    try {
      let res = await fetch(
        `${backend_url}/posts/get-upvotes?post_id=${item._id}`
      );
      let data = await res.json();
      setCurrentUpvoteData(data.data[0]);
    } catch (e) {
      console.log("something went wrong", e.message);
    }
  };

  const getPostDownvotesByPostId = async () => {
    // console.log(item._id);
    try {
      let res = await fetch(
        `${backend_url}/posts/get-downvotes?post_id=${item._id}`
      );
      let data = await res.json();
      setCurrentDownvoteData(data.data[0]);
    } catch (e) {
      console.log("something went wrong", e.message);
    }
  };

  useEffect(() => {
    getPostUpvotesByPostId();
    getPostDownvotesByPostId();
  }, []);

  const handleUpvoteDownvote = async (id, type) => {
    if (type === "upvote") {
      let res = await createUpVote(id);
      if (res) {
        getPostUpvotesByPostId();
        getPostDownvotesByPostId();
        getUserLikedDislikedPosts();
      }
    } else {
      let res = await createDownVote(id);
      if (res) {
        getPostUpvotesByPostId();
        getPostDownvotesByPostId();
        getUserLikedDislikedPosts();
      }
    }
  };

  const checkIfupdated = (type) => {
    // console.log(userLikedDislikedPost);
    if (!userLikedDislikedPost) return false;
    if (type === "upvote") {
      if (!userLikedDislikedPost?.liked_posts) return false;
      if (userLikedDislikedPost.liked_posts.includes(item._id)) return true;
    } else {
      if (!userLikedDislikedPost?.disliked_posts) return false;
      if (userLikedDislikedPost.disliked_posts.includes(item._id)) return true;
    }
    return false;
  };

  const handleToggleComments = () => {
    navigation.navigate("PostDetails", {
      postId: item.unique_id,
      handleUpvoteDownvote,
      checkIfupdated,
    });
  };

  const toggleTextVisibility = () => {
    setShowFullText((prevState) => !prevState);
  };

  const displayText = showFullText
    ? item?.Text
    : (item?.Text || "").slice(0, 300);

  const handleFollowButtonPress = (username) => {
    if (userInfo) {
      handleFollow(item?.user);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleImageClick = (image) => {
    setShowFullImage(true);
    setFullImage(image);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Avatar.Image
          size={35}
          style={{ marginTop: 4.5 }}
          source={{
            uri: item?.userDetails?.userpic_url,
          }}
        />
        <View style={styles.userInfo}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.username}>
              {`${capitalFirstLetter(
                item.userDetails?.First_Name
              )} ${capitalFirstLetter(item.userDetails?.last_name)} `}
            </Text>
            <View style={styles.followButton}>
              <Text style={styles.followIcon}>
                {" "}
                {checkFollow(myFollowings, item?.user) ? "" : "•"}
              </Text>
              <TouchableOpacity
                onPress={() => handleFollowButtonPress("username")}
              >
                <Text style={styles.followText}>
                  {checkFollow(myFollowings, item?.user) ? "" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 2, marginTop: -10 }}>
            <Text style={styles.infoText}>{item?.userDetails?.username}</Text>
            <Text style={styles.infoText2}>.</Text>
            <Text style={styles.infoText}>
              {" "}
              {`${time_difference(item.Created_at).join("")}`}
            </Text>
            <Text style={styles.infoText2}>.</Text>
            <Text style={styles.infoText}> {formatDate(item.Created_at)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleToggleComments}>
        <View style={styles.textcotainer}>
          {item?.Title && <Text style={styles.title}>{item?.Title}</Text>}

          {item.post_type === 3 && (
            <Text style={{ fontSize: 14, userSelect: "text" }}>
              {item.query_question}
            </Text>
          )}

          {!(item.post_type === 3) && (
            <Text style={styles.description}>{displayText}</Text>
          )}
          {item?.Text?.length > 300 && (
            <TouchableOpacity onPress={toggleTextVisibility}>
              <Text style={styles.seeMoreText}>
                {showFullText ? "See Less" : "See More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {item && item.Image ? (
        <View>
          <TouchableOpacity onPress={() => handleImageClick(item.Image)}>
            <Image
              source={{
                uri: item.Image,
              }}
              style={styles.Image}
            />
          </TouchableOpacity>

          <Modal
            visible={showFullImage}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContent}>
              {/* Move the TouchableOpacity for the close button to the top-right corner */}
              <TouchableOpacity
                onPress={() => setShowFullImage(false)}
                style={styles.closeButtonContainer}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Image source={{ uri: fullImage }} style={styles.modalImage} />
            </View>
          </Modal>
        </View>
      ) : null}

      <Divider />
      <View style={styles.IconsBottom}>
        {/* Upvote */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon
            name="arrow-up-bold-outline"
            size={20}
            color={checkIfupdated("upvote") ? "#5d20d2" : "#3a4044"}
            onPress={() => {
              if (userInfo) {
                handleUpvoteDownvote(item._id, "upvote");
              } else {
                Alert.alert(
                  "Login Required",
                  "You need to be logged in to upvote.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Login",
                      onPress: () => {
                        navigation.navigate("Login");
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }
            }}
          />
          <Text>{currentUpvoteData.upvote?.length || 0}</Text>
        </View>

        {/* Downvote */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon
            name="arrow-down-bold-outline"
            color={checkIfupdated("downvote") ? "#5d20d2" : "#3a4044"}
            size={20}
            onPress={() => {
              if (userInfo) {
                handleUpvoteDownvote(item._id, "downvote");
              } else {
                Alert.alert(
                  "Login Required",
                  "You need to be logged in to downvote.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Login",
                      onPress: () => {
                        navigation.navigate("Login");
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }
            }}
          />
          <Text>{currentDownvoteData?.downvote?.length || 0}</Text>
        </View>

        {/* Comments */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <TouchableOpacity onPress={handleToggleComments}>
            <Icon name="comment-text-outline" color="#3a4044" size={20} />
          </TouchableOpacity>
          <Text>{item?.comment_count ? item?.comment_count : 0}</Text>
        </View>
      </View>

      {/* {showComments && <SinglePostScreen postId={item.unique_id} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 12,
  },
  Image: {
    height: 150,
    width: "100%",
    marginTop: 5,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: "row",
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#D8D1E3",
  },
  userInfo: {
    flexDirection: "column",
    marginLeft: 15,
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: "#8b908f",
    marginTop: 3,
  },
  infoText2: {
    fontSize: 32,
    color: "#8b908f",
    marginTop: -20,
  },
  followButton: {
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  followIcon: {
    fontSize: 23,
    color: "#5d20d2",
    marginRight: 5,
  },
  followText: {
    fontSize: 12,
    color: "#5d20d2",
  },
  textcotainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  IconsBottom: {
    flexDirection: "row",
    gap: 25,
    paddingTop: 5,
  },
  seeMoreText: {
    color: "#5d20d2",
    // textDecorationLine: "underline",
  },

  image: {
    width: 200,
    height: 200,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    // Ensure the image fits without cropping
    // borderRadius: 10,
  },
  modalImage: {
    width: "90%",
    height: "35%",
    resizeMode: "contain",
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 210,
    right: 15,
    zIndex: 1,
    color: "white",
  },
  closeButton: {
    fontSize: 18,
    color: "white",
  },
});

export default SocialPost;
