import { store } from "../store";
import Axios from "axios";
import config from "../config/config";

export default (text) => {
  const date = new Date();
  const { user } = store.getState().userReducer;
  const name = `${user.firstName} ${user.lastName}(Логин: ${user.username})`;
  const log = `${name} - ${text}`;
  Axios.post(`${config.urlNode}logs?text=${log}&date=${date}`);
};
