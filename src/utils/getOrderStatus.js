const color = {
  MODERATION: "orange",
  OPEN: "green",
  IN_PROGRESS: "blue",
  COMPLETED: "red",
  CANCELLED: "red",
  WAITING_FOR_CUSTOMER_RESPONSE: "orange"
};
const text = {
  MODERATION: "на модерации",
  OPEN: "открыт",
  IN_PROGRESS: "в работе",
  COMPLETED: "закрыт",
  CANCELLED: "отменен",
  WAITING_FOR_CUSTOMER_RESPONSE: "на подтверждении"
};

export default status => {
  return { color: color[status], text: text[status] };
};
