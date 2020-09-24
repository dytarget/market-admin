import axios from "axios";
import config from "../config/config";

const sendPushNotificationToAll = (
  body,
  bodyKz,
  title,
  titleKz,
  mode,
  type
) => {
  const pushBody = {
    userIds: [],
    title,
    channelId: "max-chat-messages",
    body,
    data: {
      additionalProp1: {
        title,
        body,
        bodyKz,
        titleKz,
        type,
        mode,
      },
    },
  };

  axios
    .post(`${config.url}/api/v1/push`, pushBody, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
};

export default sendPushNotificationToAll;
