import axios from "axios";
import { store } from "../store";

const url = "http://91.201.214.201:8443";

const sendPushNotificationToMasters = (
  body,
  bodyKz,
  title,
  titleKz,
  userId,
  screen,
  itemId,
  mode,
  type,
  clientModal,
  masterModal,
  clientId,
  masterId
) => {
  const pushBody = {
    userIds: userId,
    title,
    channelId: "chat-messages",
    body,
    data: {
      additionalProp1: {
        screen,
        title,
        body,
        bodyKz,
        titleKz,
        type,
        mode,
      },
      additionalProp2: { itemId, clientModal, masterModal, clientId, masterId },
    },
  };

  axios
    .post(`${url}/api/v1/push`, pushBody, {
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

export default sendPushNotificationToMasters;
