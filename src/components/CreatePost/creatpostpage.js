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
import { Avatar, Divider, Snackbar } from "react-native-paper";
import { capitalFirstLetter } from "../../common";
import { useNavigation } from "@react-navigation/native";
import { useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";
import { backend_url } from "../../../https-common";
import CreateQueryPage from "./careatequerypage";
import { AppContext } from "../../context/AppContext";

const CreatePostPage = ({ username }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { userInfo, setPosts } = useContext(AppContext);
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState("");
  const { values, setFieldValue, resetForm, errors } = useFormikContext();
  const [createLoading, setCreateLoading] = useState(false);

  const toggleModal = () => {
    if (userInfo) {
      setModalVisible(!isModalVisible);
    } else {
      navigation.navigate("Login"); // Navigate to the login screen
    }
  };

  const windowHeight = Dimensions.get("window").height;

  const getSinglePost = async (uid) => {
    try {
      let res = await fetch(`${backend_url}/post-by-postId/${uid}`);
      let singlePost = await res.json();
      singlePost = singlePost.posts[0];
      setPosts((prev) => [singlePost, ...prev]);
    } catch (e) {
      console.log("not able to fetch");
    }
  };

  const handleCreatePost = async () => {
    let url;
    let uuidForPost = uuidv4();
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
      unique_id: uuidForPost,
      user: `${userInfo?.username}`,
      Title: values?.title,
      Text: values?.description,
      Up_vote: 0,
      Down_vote: 0,
      Comment_count: 0,
      post_type: 1,
      Created_at: Date.now(),
    };

    const payloadjson = JSON.stringify(form);
    try {
      const response = await fetch(`${backend_url}/create-post`, {
        method: "POST",
        body: payloadjson,
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // console.log("is response ok working");
        setSnackbarVisible(true); // Show the Snackbar
        setSnackbarMessage("Post created successfully");
        resetForm();
        // fetchPosts();
        getSinglePost(uuidForPost);
        toggleModal();
      } else {
        // Handle error
        setSnackbarVisible(true); // Show the Snackbar
        setSnackbarMessage("Error creating post");
        console.log("Error:", data.error); // Log the error for debugging
        // Show an error message to the user
      }
    } catch (error) {
      console.log("Fetch error:", error); // Log the error for debugging
      // Show an error message to the user
    }
  };

  const handleCreate = () => {
    if (values?.description !== "") {
      setCreateLoading(true);
      // setOpen(false);
      handleCreatePost();
      // resetForm();
    }
  };

  const handleFieldChange = (field, value) => {
    setFieldValue(field, value); // Use setFieldValue to update Formik values
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.followButton} onPress={toggleModal}>
        <AntDesignIcon
          name="pluscircleo"
          size={22}
          color="black"
          onPress={toggleModal}
        />
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
              marginBottom: 7,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <TouchableOpacity onPress={toggleModal}>
                <AntDesignIcon
                  name="close"
                  size={18}
                  color="black"
                  onPress={toggleModal}
                />
              </TouchableOpacity>
              <Text style={{ fontWeight: 600, fontSize: 20, marginLeft: 10 }}>
                Share An Idea
              </Text>
            </View>
            <TouchableOpacity
              style={
                values?.description === ""
                  ? styles.postButton
                  : styles.postButtonEnabled
              }
              onPress={handleCreate}
              disabled={values?.description === ""}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <Divider />
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 10,
              padding: 5,
            }}
          >
            <Avatar.Image
              size={42}
              source={{
                uri: userInfo?.userpic_url,
              }}
              style={{ marginLeft: 10 }}
            />
            <Text style={{ marginTop: 7, fontWeight: 500 }}>
              {`${capitalFirstLetter(
                userInfo?.First_Name
              )} ${capitalFirstLetter(userInfo?.last_name)}`}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title (optional)"
              onChangeText={(text) => handleFieldChange("title", text)}
              value={values?.title}
            />
            <TextInput
              style={styles.input}
              placeholder="What do you want to talk about? (Required)"
              onChangeText={(text) => handleFieldChange("description", text)}
              value={values?.description}
              multiline // Enable multiline for longer text
            />
          </View>

          <View style={styles.bottomContainer}>
            {/* <TouchableOpacity style={styles.bottomIcon}>
              <View style={styles.iconBackground}>
                <Icon name="camera" size={24} color="gray" />
              </View>
            </TouchableOpacity> */}

            <CreateQueryPage />
            {/* <TouchableOpacity style={styles.bottomIcon}>
              <View style={styles.iconBackground}>
                <Icon name="bar-chart" size={24} color="gray" />
              </View>
            </TouchableOpacity> */}
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
  inputContainer: {
    marginTop: 10,
    padding: 5,
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
    marginTop: 5,
    marginBottom: 5,
  },

  postButtonEnabled: {
    width: 70,
    height: 30,
    marginTop: 5,
    marginBottom: 5,
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
    width: 40, // Adjust the width to match the desired size
    height: 40, // Adjust the height to match the desired size
    borderRadius: 20, // To create a circular background
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

export default CreatePostPage;
