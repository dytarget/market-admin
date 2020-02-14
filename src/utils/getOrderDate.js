const types = ["URGENTLY", "WITH_MASTER", "POINT_DATE"];
const texts = {
  URGENTLY: "срочно",
  WITH_MASTER: "обсудим",
  CONTRACTUAL: "обсудим"
};

export default (type, value) => {
  if (type === types[2]) {
    console.log("hello");

    if (value[2]) {
      return `${value[2]}.${value[1]}.${value[0]}`;
    } else {
      const date = new Date(value);
      const builtDate = `${date.getFullYear()}.${date.getMonth() +
        1}.${date.getDate()}`;
      console.log(builtDate);

      return builtDate;
    }
  } else {
    return texts[type];
  }
};
