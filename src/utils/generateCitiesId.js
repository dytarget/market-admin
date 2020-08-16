import { store } from "../store";

export default function (isFirst) {
  const { cities, isSuperAdmin } = store.getState().userReducer.user;
  if (isSuperAdmin) {
    return "";
  } else {
    let cityIds = "";
    cities.forEach((city) => {
      cityIds += `city=${city}&`;
    });

    cityIds = `${isFirst ? "?" : "&"}${cityIds.substring(
      0,
      cityIds.lastIndexOf("&")
    )}`;

    return cityIds;
  }
}
