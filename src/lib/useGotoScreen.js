import React, { useEffect } from "react";

export default function useGotoScreen() {
  const gotoscreen = (screen, navigation) => {
    // console.log("in gotoscreen");
    if (screen == "news") {
      navigation.navigate("NewsScreen");
    } else if (screen == "rooms") {
      navigation.navigate("Rooms");
    }
  };

  return { gotoscreen };
}
