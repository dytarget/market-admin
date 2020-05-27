import axios from "axios";
import { store } from "../store";

const url = "http://91.201.214.201:8443";

const sendPushNotificationToMasters = (
  body,
  title,
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
  const { token } = store.getState().userReducer;
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
