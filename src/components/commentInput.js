import React, { useContext, useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { backend_url } from "../../https-common";
import { AppContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";

const CommentInput = ({ postId, fetchPost, updateCommentCount }) => {
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { userInfo } = useContext(AppContext);

  // console.log("picture nhi aa rha", userInfo);

  const getComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`${backend_url}/get-comments/${postId}`);
      const data = await response.json();
      setCommentData(data?.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const handleCommentPost = async () => {
    if (!comment.trim()) return; // Don't add empty comments

    if (!userInfo) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to post a comment.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => {
              // Navigate to the login page here
              // For example: navigation.navigate('Login');
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    let form = {
      comment_unique_id: uuidv4(),
      comment_text: comment,
      comment_post_id: postId,
      comment_user_id: userInfo.username,
      Comment_created_at: Date.now(),
      userDetails: {
        First_Name: userInfo.First_Name,
        username: userInfo.username,
        last_name: userInfo.last_name,
        userpic_url: userInfo.userpic_url,
      },
      Image: null, // Assuming you are not including an image for each comment
    };

    // setCommentData((comments) => [form, ...comments]);
    setComment("");

    try {
      await fetch(`${backend_url}/add-comment/${postId}`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
        },
      });
      fetchPost();

      // Increment the comment count and update the userPosts array
      updateCommentCount(commentData.length + 1);

      // Fetch latest comments again after adding the new comment
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // =========Image================

  return (
    <View style={styles.container}>
      <View style={styles.commentInputContainer}>
        <Avatar.Image
          size={33}
          source={{
            uri: userInfo?.userpic_url,
          }}
        />

        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handleCommentPost}
          disabled={!comment.trim()} // Disable the button when the comment is empty
        >
          <Icon name="send" color="#5d20d2" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 150,
    fontSize: 16,
    marginLeft: 10,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommentInput;
