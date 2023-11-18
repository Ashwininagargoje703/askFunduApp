import React, { useContext, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import { Menu, IconButton } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { Alert } from "react-native";
import { backend_url } from "../../https-common";

const CommnetDropdown = ({
  commentId,
  comments,
  setComments,
  updateCommentCount,
  handleOpenEditCommentInput,
}) => {
  // console.log("ahe ka commnetID", commentId);
  const [showDelete, setShowDelete] = useState(false);
  const toggleMenu = () => setShowDelete((prevShowDelete) => !prevShowDelete);

  const handleDeleteComment = async (commentId) => {
    // Show a confirmation dialog before deleting the comment
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            handleDeleteCommentBackend(commentId);
            setShowDelete(false); // Close the menu after deletion
          },

          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteCommentBackend = async (commentId) => {
    // console.log("kyahia id", commentId);
    try {
      const response = await fetch(
        `${backend_url}/delete-comment/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Comment deleted successfully!");
        // Remove the deleted comment from the comments array and set the updated comments array
        let newCommentArray = comments.filter(
          (item) => item.comment_unique_id !== commentId
        );
        setComments(newCommentArray);
        updateCommentCount(comments.length - 1);
      } else {
        console.log("Failed to delete the comment.");
      }
    } catch (error) {
      console.log("Network error occurred:", error);
    }
  };

  return (
    <View>
      <Menu
        visible={showDelete}
        onDismiss={() => setShowDelete(false)}
        anchor={<IconButton icon="dots-vertical" onPress={toggleMenu} />}
        style={styles.container}
      >
        <Menu.Item
          onPress={() => handleDeleteComment(commentId)}
          icon="delete"
          title="Delete"
        />

        <Menu.Item
          onPress={() => handleOpenEditCommentInput(commentId)}
          icon="pencil"
          title="Edit"
        />
      </Menu>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 40,
    padding: 10,
    marginLeft: -50,
    marginTop: -300,
  },
  texticon: {
    flexDirection: "row",
    textAlign: "left",
  },
  iconButton: {
    marginTop: -10,
    position: "absolute", // Add position: 'absolute' to the IconButton
    zIndex: 2, // Add zIndex to the IconButtonma
    marginLeft: -10,
  },
  text: {
    marginLeft: 25,
    // Add any styles you need for the text
  },
});

export default CommnetDropdown;
