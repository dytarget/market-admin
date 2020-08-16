const types = {
  VERIFIED: "Проверен",
  NOT_VERIFIED: "Не проверен",
  D0C_VERIFIED: "Документ проврен",
  DOC_NOT_VERIFIED: "Документ не проверен",
  BLOCKED: "Заблокирован",
};

export default (type) => {
  return types[type];
};
