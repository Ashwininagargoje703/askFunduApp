import { registerRootComponent } from "expo";
import App from "./App";
import AppContextProvider from "./src/context/AppContext";
import { NavigationContainer } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/Translation/i18next";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import cometchatInit, { loginUser } from "./src/cometchat_init";
import dynamicLinks from "@react-native-firebase/dynamic-links";

const prefix = Linking.createURL("/");

const ContextWrap = () => {
  const [iurl, setIurl] = useState(null);
  const [sUrl, setSUrl] = useState(null);

  useEffect(() => {
    cometchatInit();
  }, []);

  // created build with this code after this if failed need to build it with this code commented
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link !== null) {
          setSUrl(link.url);
        } else {
          setSUrl(null);
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link) => {
      if (link.url) {
        // Now you have the deep link URL, do what you need with it
        const deepLinkUrl = link.url;
        // ...
        setSUrl(deepLinkUrl);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AppContextProvider>
        <NavigationContainer>
          <App urlParams={iurl} sUrl={sUrl} />
        </NavigationContainer>
      </AppContextProvider>
    </I18nextProvider>
  );
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(ContextWrap);
