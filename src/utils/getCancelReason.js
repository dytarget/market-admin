const types = {
  NOT_ACTUAL: "Заказ стал не актуален",
  NOT_FOUND_MASTER: "Не нашел на Сервисе подходящего Мастера",
  FOUND_FROM_ANOTHER_SOURCE: "Нашел другим способом(не ч/з Сервис)",
  OTHER: "Другое",
};

export default (type) => {
  return types[type];
};
