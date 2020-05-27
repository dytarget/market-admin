const types = ["FIXED", "UP_TO", "CONTRACTUAL"];

const texts = {
  CONTRACTUAL: "договормися",
  UP_TO: "до"
};

export default (type, value) => {
  if (type === types[2]) {
    return texts[type];
  } else if (type === types[0]) {
    return value;
  } else if (type === types[1]) {
    return texts[type];
  }
};
