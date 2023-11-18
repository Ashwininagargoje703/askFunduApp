import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  CometChatMessages,
  CometChatUI,
} from "../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src";
import { CometChat } from "@cometchat-pro/react-native-chat";
import { COMETCHAT_TIMEOUT } from "../lib/constants";

const CometChatScreen = ({ route, navigation }) => {
  const [userToChatWith, setUserToChatWith] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const timeRef = useRef(null);

  const { chatWithUid, setIsClickedOnChat } = route.params;

  useEffect(() => {
    CometChat.getUser(chatWithUid).then((res) => setUserToChatWith(res));
    CometChat.getLoggedinUser().then((res) => setLoggedInUser(res));
  }, []);

  useEffect(() => {
    timeRef.current = setTimeout(() => {
      setIsClickedOnChat(false);
      navigation.goBack();
    }, COMETCHAT_TIMEOUT);

    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  return (
    loggedInUser &&
    userToChatWith && (
      <CometChatMessages
        type={"user"}
        item={userToChatWith} //The object will be of user or group depending on type
        loggedInUser={loggedInUser}
        actionGenerated={(actionType) => {
          console.log(actionType);
        }}
        navigation={navigation}
      />
      // <CometChatUI />
    )
  );
};

export default CometChatScreen;
