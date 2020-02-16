import axios from "axios";
import { store } from "../store";

const url = "http://91.201.214.201:8443/";

const sendPushNotification = (body, title, userId) => {
  const { token } = store.getState().userReducer;
  const pushBody = {
    body,
    channelId: "chat-messages",
    priority: "DEFAULT",
    sound: "default",
    title
  };

  console.log(pushBody);
  console.log(userId);

  axios
    .post(`${url}api/v1/push/${userId}`, pushBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(JSON.stringify(err));
    });
};

export default sendPushNotification;
