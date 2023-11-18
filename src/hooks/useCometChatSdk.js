import { CometChat } from "@cometchat-pro/react-native-chat";

export default function useMakeCometChatProfile() {
  let authKey = "b2a119090e51f60c174c2588afadc6c07cd2ac9f";
  const createCommetChatUser = (usertomake) => {
    let uid = usertomake?.username;
    let name = usertomake?.First_Name + " " + usertomake?.last_name;
    let avtar = usertomake?.userpic_url;

    let user = new CometChat.User(uid);
    user.setName(name);
    user.setAvatar(avtar);
    CometChat.createUser(user, authKey).then(
      (user) => {
        console.log("user created", user);
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  return { createCommetChatUser };
}
