import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { AntDesign as AntDesignIcon, FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { Avatar, Snackbar } from "react-native-paper";
import { capitalFirstLetter } from "../../common";
import { AppContext } from "../../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { backend_url } from "../../../https-common";

const CreateQueryPage = ({ username }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { userInfo, fetchPosts } = useContext(AppContext);
  const navigation = useNavigation();
  const [queryTitle, setQueryTitle] = useState("");
  const [queryQuestion, setQueryQuestion] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const toggleModal = () => {
    if (userInfo) {
      setModalVisible(!isModalVisible);
    } else {
      navigation.navigate("Login"); // Navigate to the login screen
    }
  };

  const windowHeight = Dimensions.get("window").height;

  const createBotCommentOnQuery = async (post_unique_id, post_text) => {
    let answer = await fetch(
      `https://news-chatbot-nl6iavcada-uc.a.run.app/ask/${post_text}`
    );

    let commentText = (answer = await answer.json());
    const form = {
      comment_unique_id: uuidv4(),
      comment_text: commentText,
      comment_post_id: post_unique_id,
      comment_user_id: "bot",
      Comment_created_at: Date.now(),
      comment_type: 2,
      userDetails: {
        First_Name: "bot",
        last_name: "bot",
        username: "bot",
      },
    };

    const payloadjson = JSON.stringify(form);
    await fetch(`${backend_url}/add-comment/${post_unique_id}`, {
      method: "POST",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    });
  };

  const handleCreateQuery = async () => {
    let uuidforpost = uuidv4();
    let url;

    const userD = {
      First_Name: `${userInfo?.First_Name}`,
      Followers: `${userInfo?.Followers}`,
      Followings: `${userInfo?.Followings}`,
      last_name: `${userInfo?.last_name}`,
      username: `${userInfo?.username}`,
      userpic_url: `${userInfo?.userpic_url}`,
      id: `${userInfo?.id}`,
    };

    const form = {
      unique_id: uuidforpost,
      user: `${userInfo?.username}`,
      Title: queryTitle,
      query_question: queryQuestion,
      Up_vote: 0,
      Down_vote: 0,
      Comment_count: 0,
      Created_at: Date.now(),
      post_type: 3,
    };

    // const newObj = {
    //   unique_id: uuidv4(),
    //   user: `${user?.username}`,
    //   Title: queryTitle,
    //   Image: url,
    //   Tag: selectedTags,
    //   query_question: queryQuestion,
    //   Up_vote: 0,
    //   Down_vote: 0,
    //   Comment_count: 0,
    //   Created_at: Date.now(),
    //   post_type: 3,
    //   userDetails: userD,
    // };

    // setUserPosts((d) => [newObj, ...d]);

    const payloadjson = JSON.stringify(form);
    fetch(`${backend_url}/create-post`, {
      method: "POST",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("response", response);
        const newStatus = {
          status: response.status,
          from: "Query",
          as: "Created",
        };
        setSnackbarVisible(true); // Show the Snackbar
        setSnackbarMessage("Post created successfully");
        setModalVisible(!isModalVisible);
        createBotCommentOnQuery(uuidforpost, queryQuestion);
        setQueryTitle("");
        setQueryQuestion("");
        // resetForm();
      })

      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bottomIcon} onPress={toggleModal}>
        <View style={styles.iconBackground}>
          <Icon name="question" size={34} color="gray" onPress={toggleModal} />
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={{ height: windowHeight, backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              margin: 3,
              borderBottomWidth: 1,
              borderBottomColor: "gray",
              paddingBottom: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 8,
                marginBottom: 8,
                marginHorizontal: 10,

                // Add padding to separate from the content
              }}
            >
              <TouchableOpacity onPress={toggleModal}>
                <AntDesignIcon
                  name="arrowleft"
                  size={22}
                  color="black"
                  onPress={toggleModal}
                />
              </TouchableOpacity>

              <Text style={{ fontWeight: 700, marginLeft: 10 }}>
                Raise Your Query
              </Text>
            </View>

            <TouchableOpacity
              style={
                queryTitle === "" || queryQuestion === ""
                  ? styles.postButton
                  : styles.postButtonEnabled
              }
              onPress={handleCreateQuery}
            >
              <Text style={styles.postButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 4,
              marginHorizontal: 10,
            }}
          >
            <Avatar.Image
              size={35}
              source={{
                uri: userInfo?.userpic_url,
              }}
            />

            <Text style={{ marginTop: 1, fontWeight: 500 }}>
              {`${capitalFirstLetter(
                userInfo?.First_Name
              )} ${capitalFirstLetter(userInfo?.last_name)}`}
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="Query Name (Required)"
              onChangeText={(text) => setQueryTitle(text)}
              value={queryTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Query Description (Required)"
              value={queryQuestion}
              onChangeText={(text) => setQueryQuestion(text)}
              multiline // Enable multiline for longer text
            />
          </View>

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)} // Hide Snackbar on dismiss
            duration={3000} // Duration for Snackbar visibility
            action={{
              label: "Dismiss",
              onPress: () => setSnackbarVisible(false),
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  input: {
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: "#c5c7c7", // Default background color for the disabled button
    width: 70,
    height: 30,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },

  postButtonEnabled: {
    width: 70,
    height: 30,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5d20d2",
    backgroundColor: "#5d20d2",
    marginTop: 8,
  },
  postButtonText: {
    fontSize: 12,
    color: "white",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    position: "absolute", // Position the container at the bottom
    bottom: 0, // Align it at the bottom of the parent container
    width: "100%", // Take up the full width
    backgroundColor: "white",
  },

  bottomIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 45, // Adjust the width to match the desired size
    height: 45, // Adjust the height to match the desired size
    borderRadius: 60, // To create a circular background
  },

  iconBackground: {
    backgroundColor: "lightgray", // Gray background color
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // To create a circular background
  },
});

export default CreateQueryPage;
