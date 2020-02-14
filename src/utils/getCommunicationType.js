const types = {
  CALL: "Звонки и сообщения",
  MESSAGE: "Только сообщения"
};

export default type => {
  return types[type];
};
