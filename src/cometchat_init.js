import { CometChat } from "@cometchat-pro/react-native-chat";

const appID = "2369283ed2432262";
const region = "us";

const cometchatInit = () => {
  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();
  CometChat.init(appID, appSetting).then(
    () => {
      console.log("Initialization completed successfully");
      // You can now call login function.
    },
    (error) => {
      console.log("Initialization failed with error:", error);
      // Check the reason for error and take appropriate action.
    }
  );
};

export const loginUser = async (username) => {
  // console.log(username);
  const authKey = "b2a119090e51f60c174c2588afadc6c07cd2ac9f";
  const uid = username;

  try {
    await CometChat.login(uid, authKey);
    return true;
  } catch (error) {
    return false;
  }
  // .then(
  //   (user) => {
  //     console.log("Login Successful:", { user });
  //     return true;
  //   },
  //   (error) => {
  //     console.log("Login failed with exception:", { error });
  //     return false;
  //   }
  // );
};

export default cometchatInit;
