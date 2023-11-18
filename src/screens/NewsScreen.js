import { FlatList, StyleSheet, Dimensions, Share, Text } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import NewsCard from "../components/NewsCard";
import { useTranslation } from "react-i18next";
import { backend_url } from "../../https-common";
import { AppContext } from "../context/AppContext";
import useGotoScreen from "../lib/useGotoScreen";
import { useRoute } from "@react-navigation/native";
import Bottom from "./Bottom";
import { View } from "react-native";
import SkeletonNewsCard from "../components/Skeleton/NewsSkeletonCard";

const WINDOW_HEIGHT = Math.ceil(Dimensions.get("window").height) - 50;
// const WINDOW_HEIGHT = Dimensions.get("window").height - 50;

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [prevSetNewsForAnonUser, setPrevSetNewsForAnonUser] = useState(false);
  const [newsForLoggedInFetched, setNewsForLoggedInFetched] = useState(false);
  const { userInfo, initUrl, setInitUrl, ss } = useContext(AppContext);
  const { gotoscreen } = useGotoScreen();
  const route = useRoute();
  const flatListRef = useRef(null);

  useEffect(() => {
    if (ss !== null) {
      return gotoscreen(ss, navigation);
      // if (ss == "news" && route.name !== "NewsScreen") {
      //   return gotoscreen(ss, navigation);
      // }
    }
  }, []);
  const [visibleNewsIndex, setVisibleNewsIndex] = useState(0);

  useEffect(() => {
    setLanguage(i18n.language);
    setPage(1);
    setNews([]);
  }, [i18n.language, language]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = `${backend_url}/get-all-news?pageSize=10&pageNo=${page}&lan=${language}`;
      let res = await fetch(url);
      let data = await res.json();
      if (userInfo === null && prevSetNewsForAnonUser === false) {
        setPrevSetNewsForAnonUser(true);
        setNews(data.news);
      } else {
        setNews([...news, ...data.news]);
      }
      setLoading(false);
    } catch (e) {
      console.log("something went wrong ->", e);
    }
  };
  const fetchReccomendedNews = async () => {
    setLoading(true);
    try {
      let url = `${backend_url}/users/news/reccom/${userInfo.username}?lan=${language}`;
      let res = await fetch(url);
      let data = await res.json();
      setNews(data.news);
      setLoading(false);
    } catch (e) {
      console.log("something went wrong ->", e);
    }
  };

  const fetchOneNews = async () => {
    if (initUrl) {
      try {
        let url = `${backend_url}/getNewsById/${initUrl}`;

        let res = await fetch(url);
        let data = await res.json();
        setNews(data.news);
        setPrevSetNewsForAnonUser(true);
        setInitUrl(null);
        setSs(null);
        setLoading(false);
      } catch (e) {
        setNews([]);
        setLoading(false);
        setPrevSetNewsForAnonUser(true);
        setInitUrl(null);
        setSs(null);
      }
    }
  };

  useEffect(() => {
    if (initUrl) {
      fetchOneNews();
    } else {
      if (userInfo && news.length == 0) {
        fetchReccomendedNews();
        setNewsForLoggedInFetched(true);
      } else if (userInfo && newsForLoggedInFetched) {
        fetchNews();
      } else {
        fetchNews();
      }
    }
  }, [page, language, userInfo, initUrl]);

  const handleEndReached = () => {
    if (!loading) {
      setPage(page + 1);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setVisibleNewsIndex(viewableItems[0].index);
    }
  });

  const renderItem = ({ item, index }) => {
    if (index === visibleNewsIndex) {
      return <NewsCard item={item} index={index} />;
    } else {
      return (
        <View style={{ height: WINDOW_HEIGHT }}>
          <SkeletonNewsCard />
        </View>
      );
    }
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        // data={news.slice(visibleNewsIndex, visibleNewsIndex + 1)}
        data={news} // Only render news items up to the visibleNewsIndex
        renderItem={({ item, index, visibleNewsIndex }) => (
          <NewsCard
            item={item}
            index={index}
            visibleNewsIndex={visibleNewsIndex}
          />
        )}
        // renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        pagingEnabled={true}
        snapToInterval={WINDOW_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={5 + 10 * (page - 1)}
        disableIntervalMomentum={true}
        initialNumToRender={1}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />

      <Bottom />
    </>
  );
};

export default NewsScreen;
