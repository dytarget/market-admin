export default value => {
  if (value < 20) {
    return "Новичок";
  } else if (value >= 20 && value < 60) {
    return "Специалист";
  } else if (value >= 60 && value < 80) {
    return "Эксперт";
  } else if (value > 80) {
    return "Профессионал";
  }
};
