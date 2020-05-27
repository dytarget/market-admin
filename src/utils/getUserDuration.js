import moment from "moment";

const getMonth = (value) => {
  if (value === 0) {
    return "";
  } else if (value === 1) {
    return value + " месяц ";
  } else if (value > 1 && value < 5) {
    return value + " месяца ";
  } else if (value >= 5) {
    return value + " месяцев ";
  }
};

const getDay = (value) => {
  if (value === 0) {
    return "";
  } else if (value === 1) {
    return value + " день ";
  } else if (value > 1 && value < 5) {
    return value + " дня ";
  } else if (value >= 5) {
    return value + " дней ";
  }
};

const getYear = (value) => {
  if (value === 0) {
    return "";
  } else if (value === 1) {
    return value + " год ";
  } else if (value > 1 && value < 5) {
    return value + " года ";
  } else if (value >= 5) {
    return value + " лет ";
  }
};

export default (timestamp) => {
  const date1 = new Date();

  var a = moment(date1);
  var b = moment([timestamp[0], timestamp[1] - 1, timestamp[2] + 1]);

  var years = a.diff(b, "year");
  b.add(years, "years");

  var months = a.diff(b, "months");
  b.add(months, "months");

  var days = a.diff(b, "days");

  let message = `${getYear(years)}${getMonth(months)}${getDay(days)}`;

  if (message.length === 0) {
    message = "Сегодня";
  }
  return message;
};
