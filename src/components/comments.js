import React, { useContext, useEffect, useState } from "react";

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { backend_url } from "../../https-common";
import { Avatar, PaperProvider } from "react-native-paper";
import { capitalFirstLetter, time_difference } from "../common";
import CommentInput from "./commentInput";
import { AppContext } from "../context/AppContext";
import CommnetDropdown from "./commnetDropdown";

const Comments = ({ postId }) => {
  // console.log("Pisis", postId);
  const [comments, setComments] = useState([]);
  const { userPosts, setUserPosts, userInfo } = useContext(AppContext);
  const [openEditCommentInput, setOpenEditCommentInput] = useState({
    id: "",
    status: false,
  });
  const [commentEditText, setCommentEditText] = useState("");

  const fetchPost = async () => {
    try {
      fetch(`${backend_url}/get-comments/${postId}`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data?.comments);
          console.log("commnets", data?.comments);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    } catch (e) {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const updateCommentCount = (commentCount) => {
    let postD = userPosts?.filter((item) => item.unique_id === postId)[0];

    // console.log(postId);
    // console.log(userPosts);

    let obj = {
      ...postD,
      Comment_count: commentCount,
    };

    let newPostsArray = userPosts.map((item) => {
      if (item.unique_id === postId) {
        return { ...item, Comment_count: commentCount };
      } else {
        return item;
      }
    });

    setUserPosts(newPostsArray);

    const payloadjson = JSON.stringify(obj);
    fetch(`${backend_url}/edit-post/${postId}`, {
      method: "PUT",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {})
      .catch((err) => console.log(err));
  };

  const handleOpenEditCommentInput = (id) => {
    let update = { id: id, status: true };
    setOpenEditCommentInput(() => update);
    let text = comments.filter((item) => item.comment_unique_id === id)[0]
      .comment_text;

    setCommentEditText(text);
  };

  function handleEditComment(id) {
    let newCommentArray = comments.map((item) => {
      if (item.comment_unique_id === openEditCommentInput.id) {
        return {
          ...item,
          comment_text: commentEditText,
          Comment_edited_at: Date.now(),
        };
      } else {
        return item;
      }
    });

    setComments(newCommentArray);

    let commentId = openEditCommentInput.id;

    let update = { id: "", status: false };
    setOpenEditCommentInput(() => update);

    handleEditCommentBackend(commentId);
  }

  const handleEditCommentBackend = (id) => {
    let comment = comments.filter((item) => item.comment_unique_id === id)[0];
    const form = {
      comment_unique_id: comment.comment_unique_id,
      comment_user_id: comment.comment_user_id,
      comment_post_id: comment.comment_post_id,
      comment_text: commentEditText,
      Comment_created_at: comment.Comment_created_at,
      comment_type: comment.comment_type,
      Comment_edited_at: Date.now(),
    };

    const payloadjson = JSON.stringify(form);
    fetch(`${backend_url}/edit-comment/${id}`, {
      method: "PUT",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const handleCancelEdit = () => {
    let update = { id: "", status: false };
    setOpenEditCommentInput(() => update);
  };

  return (
    <PaperProvider>
      <View>
        <View>
          <CommentInput
            postId={postId}
            userPosts={userPosts}
            setUserPosts={setUserPosts}
            updateCommentCount={updateCommentCount}
            fetchPost={fetchPost}
          />
        </View>
        {comments.map((comment, idx) => (
          <View style={styles.container} key={`comment-${idx}`}>
            <View style={styles.userInfo}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 3,
                    justifyContent: "space-between",
                    width: "96%",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar.Image
                      size={35}
                      source={{
                        uri: comment?.userDetails?.userpic_url,
                      }}
                    />
                    <Text style={styles.username}>
                      {`${capitalFirstLetter(
                        comment?.userDetails?.First_Name
                      )} ${capitalFirstLetter(
                        comment?.userDetails?.last_name
                      )} `}
                    </Text>
                    <Text style={styles.infoText2}>.</Text>
                    <Text style={styles.time}>
                      {comment.Comment_edited_at
                        ? `${time_difference(comment.Comment_edited_at).join(
                            ""
                          )} ago (edited)`
                        : `${time_difference(comment.Comment_created_at).join(
                            ""
                          )} ago`}
                    </Text>
                  </View>

                  {userInfo?.username === comment.comment_user_id && (
                    <View style={{ height: 10, marginTop: -9 }}>
                      <CommnetDropdown
                        commentId={comment.comment_unique_id} // Pass the correct comment's unique ID
                        comments={comments}
                        setComments={setComments}
                        updateCommentCount={updateCommentCount}
                        handleOpenEditCommentInput={handleOpenEditCommentInput}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.text}>
                  <Text key={comment.id} style={styles.comment_text}>
                    {comment.comment_text}
                  </Text>

                  {comment.comment_unique_id === openEditCommentInput.id &&
                    openEditCommentInput.status && (
                      <View>
                        <TextInput
                          style={{
                            fontSize: 14,
                            height: 35,
                            borderRadius: 16,
                            backgroundColor: "#fff",
                            marginTop: 10,
                          }}
                          multiline
                          placeholder="Edit comment..."
                          value={commentEditText}
                          onChangeText={(text) => setCommentEditText(text)}
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 8,
                          }}
                        >
                          <TouchableOpacity
                            onPress={handleEditComment}
                            disabled={
                              comment.comment_text === commentEditText ||
                              commentEditText === ""
                            }
                            style={{
                              backgroundColor:
                                comment.comment_text === commentEditText ||
                                commentEditText === ""
                                  ? "#b8b7bb"
                                  : "#5d20d2",
                              borderRadius: 8,
                              paddingVertical: 5,
                              paddingHorizontal: 12,
                              marginRight: 8,
                            }}
                          >
                            <Text style={{ color: "white" }}>Save changes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleCancelEdit}
                            style={{
                              backgroundColor: "white",
                              borderRadius: 8,
                              paddingVertical: 5,
                              paddingHorizontal: 12,
                              marginRight: 8,
                              borderColor: "#5d20d2",
                              borderWidth: 1,
                            }}
                          >
                            <Text style={{ color: "#5d20d2" }}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </PaperProvider>
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
    marginTop: 5,
  },
  userContainer: {
    flexDirection: "column",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
  },
  infoText: {
    fontSize: 12,
    color: "#8b908f",
    marginTop: -14,
  },
  time: {
    fontSize: 12,
    color: "#8b908f",
    marginTop: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 8,
  },
  infoText2: {
    fontSize: 32,
    color: "#8b908f",
    marginTop: -18,
  },
  comment_text: {
    marginTop: 6,
    lineHeight: 19,
  },

  text: {
    marginLeft: 42,
  },
});

export default Comments;
