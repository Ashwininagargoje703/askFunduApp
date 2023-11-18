import React, { createContext, useCallback, useEffect, useState } from "react";
import { backend_url } from "../../https-common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRequest } from "../services/request";

// Create a new context instance
export const AppContext = createContext();

// Create a context provider component
export default AppContextProvider = ({ children }) => {
  const [webViewOpener, setWebViewOpener] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("https://web.askfundu.com");
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userNewsInteraction, setUserNewsInteraction] = useState([]);
  const [token, setToken] = useState(null);
  const [savedNews, setSavedNews] = useState([]);
  const [initUrl, setInitUrl] = useState(null);
  const [ss, setSs] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [firstPageLoaded, setFirstPageLoaded] = useState(false);
  const [myFollowings, setMyFollowings] = useState([]);
  const [userLikedDislikedPost, setUserLikedDislikedPost] = useState(null);
  const [userNewsTimeInteraction, setUserNewsTimeInteraction] = useState([]);
  const [openConfirmationBox, setOpenConfirmationBox] = useState({
    status: false,
    text: "",
    fnc: "",
    id: "",
    from: "",
  });

  const handleSetUserNewsInteraction = (newsid, timeInSec) => {
    // console.log("id and sec -> ", newsid, timeInSec);
    // console.log("data to save -> ", userNewsInteraction);
    setUserNewsInteraction((prev) => [
      ...prev,
      {
        newsid,
        timeInSec,
      },
    ]);
  };

  const isDeviceTokenExistsAndSave = async (deviceToken, fcmToken) => {
    try {
      if (
        userInfo &&
        (userInfo?.deviceToken === undefined || userInfo?.deviceToken == false)
      ) {
        let payload = JSON.stringify({
          username: userInfo.username,
          token: deviceToken,
          fcmToken,
        });
        // console.log("is coming into this? after logout", userInfo.deviceToken);
        let response = await fetch(`${backend_url}/users/save-device-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        });
        let deviceInfo = await response.json();
        setUserInfo({
          ...userInfo,
          deviceToken: deviceInfo.deviceToken,
        });
        await AsyncStorage.setItem("user", JSON.stringify(userInfo));
      }
    } catch (e) {
      console.log(e.message, "what is the error");
    }
  };

  const handleWebViewSettings = (url) => {
    setWebViewUrl(url);
    setWebViewOpener(!webViewOpener);
  };

  const getSavedNews = async () => {
    if (!userInfo) return;
    if (!userInfo.username) {
      return;
    }
    // console.log("is mutiple calle");
    try {
      const response = await fetch(
        `${backend_url}/users/get-saved-news/${userInfo.username}`
      );
      const data = await response.json();
      setSavedNews(data?.savedItems[0]?.news);
      // console.log("saved news", data?.savedItems[0]?.news.length);
    } catch (error) {
      console.error("Error while fetching saved news:", error);
    }
  };

  const addSavedNews = async (news_id) => {
    if (!userInfo) return;
    if (!userInfo.username) {
      return;
    }
    let payload = JSON.stringify({
      news_id: news_id,
    });
    // console.log("Adding news to saved list:", news_id);

    try {
      await fetch(
        `${backend_url}/users/create-saved-news/${userInfo.username}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      getSavedNews();
    } catch (error) {
      console.error("Error while adding news:", error);
    }
  };

  const removeSavedNews = async (news_id) => {
    if (!userInfo) return;
    if (!userInfo.username) {
      return;
    }
    let payload = JSON.stringify({
      news_id: news_id,
    });
    // console.log("Adding news to saved 444444:", news_id);

    try {
      await fetch(`${backend_url}/users/remove-saved-news`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });
      getSavedNews();
    } catch (error) {
      console.error("Error while removing news:", error);
    }
  };

  useEffect(() => {
    getSavedNews();
  }, [userInfo]);

  // -----------POST----------------

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${backend_url}/posts/get-all-posts?perPage=10&page=${page}`;
      let res = await fetch(url);
      let data = await res.json();

      // Check if there's more data to load
      if (data.data.posts.length < 10) {
        setAllDataLoaded(true);
      }

      // Append new posts to the existing posts
      setPosts((prevPosts) => [...prevPosts, ...data.data.posts]);

      // Set the firstPageLoaded state to true after loading the first page
      if (page === 1) {
        setFirstPageLoaded(true);
      }

      setLoading(false);
    } catch (e) {
      console.log("Something went wrong ->", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const createUpVote = async (post_id) => {
    // console.log("kya hai undefine", post_id);
    if (!userInfo) return;
    if (!userInfo.username) {
      return;
    }
    let payload = JSON.stringify({
      post_id: post_id,
    });
    console.log("Adding", post_id);

    try {
      let response = await fetch(`${backend_url}/posts/upvote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });
      response = await response.json();
      return true;
    } catch (error) {
      console.error("Error while adding or removing upvote:", error);
    }
  };

  const createDownVote = async (post_id) => {
    if (!userInfo) return;
    if (!userInfo.username) {
      return;
    }
    let payload = JSON.stringify({
      post_id: post_id,
    });
    console.log("removing downvote", post_id);

    try {
      let response = await fetch(`${backend_url}/posts/downvote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });
      response = await response.json();
      return true;
    } catch (error) {
      console.error("Error while adding or removing downvote:", error);
    }
  };

  // ---------------------Follow-----------------------

  const fetchMyFollowings = async () => {
    if (userInfo) {
      try {
        let res = await fetch(
          `${backend_url}/users/get-followings/${userInfo.username}`
        );
        res = await res.json();
        setMyFollowings(res.data.following);
        // console.log("followings", res);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMyFollowings();
    }
  }, [userInfo?.username]);

  const handleFollow = async (username, id) => {
    // console.log("id and username in handlefollow", id, username);

    try {
      let followed = false;
      myFollowings.forEach((item) => {
        if (item?.userId?.username == username) {
          followed = true;
          return;
        }
      });

      if (followed) {
        let res = await fetch(`${backend_url}/users/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
        // console.log("unfollowed res");
        fetchMyFollowings();
        // fetchFollowers({ username });
      } else {
        let res = await fetch(`${backend_url}/users/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
        // console.log("followed res");
        fetchMyFollowings();
        // fetchFollowers({ username });
      }
    } catch (error) {
      console.error("Error while handling follow/unfollow:", error);
    }
  };

  const getUserLikedDislikedPosts = async () => {
    if (!userInfo) return;
    try {
      let user = await fetch(
        `${backend_url}/get-user-by-name/${userInfo.username}`
      );
      user = await user.json();
      user = user?.response[0];
      setUserLikedDislikedPost({
        liked_posts: user?.liked_posts || [],
        disliked_posts: user?.disliked_posts || [],
      });
    } catch (e) {
      console.log("not able to fetch user data");
    }
  };

  // Define the state and functions you want to share
  const contextValue = {
    webViewOpener,
    setWebViewOpener,
    webViewUrl,
    setWebViewUrl,
    handleWebViewSettings,
    userInfo,
    setUserInfo,
    accessToken,
    setAccessToken,
    token,
    setToken,
    isDeviceTokenExistsAndSave,
    handleSetUserNewsInteraction,
    savedNews,
    removeSavedNews,
    addSavedNews,
    initUrl,
    setInitUrl,
    ss,
    setSs,
    createUpVote,
    posts,
    setPosts,
    loading,
    setLoading,
    page,
    setPage,
    allDataLoaded,
    setAllDataLoaded,
    firstPageLoaded,
    setFirstPageLoaded,
    createDownVote,
    handleFollow,
    myFollowings,
    fetchMyFollowings,
    openConfirmationBox,
    setOpenConfirmationBox,
    getUserLikedDislikedPosts,
    userLikedDislikedPost,
    setPosts,
    setUserNewsTimeInteraction,
    userNewsTimeInteraction,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
