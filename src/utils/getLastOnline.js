import moment from "moment";

const months = [
  { ru: "Января", kz: "Қаңтар" },
  { ru: "Февраля", kz: "Ақпан" },
  { ru: "Марта", kz: "Наурыз" },
  { ru: "Апреля", kz: "Сәуір" },
  { ru: "Мая", kz: "Мамыр" },
  { ru: "Июня", kz: "Маусым" },
  { ru: "Июля", kz: "Шілде" },
  { ru: "Августа", kz: "Тамыз" },
  { ru: "Сентября", kz: "Қыркүйек" },
  { ru: "Октября", kz: "Қазан" },
  { ru: "Ноября", kz: "Қараша" },
  { ru: "Декабря", kz: "Желтоқсан" },
];

export default (date) => {
  const now = moment();

  const locale = "ru";
  if (date) {
    if (date[0] < now.year()) {
      return `Был в сети ${date[2]} ${months[date[1] - 1][locale]} ${
        date[0]
      } г.`;
    } else if (date[1] - 1 < now.month()) {
      return `Был в сети ${date[2]} ${months[date[1] - 1][locale]}`;
    } else if (date[2] < now.date()) {
      return `Был в сети ${date[2]} ${months[date[1] - 1][locale]}`;
    } else if (date[3] < now.hour()) {
      return `Был в сети ${date[3]}:${date[4] > 9 ? date[4] : `0${date[4]}`}`;
    } else if (date[3] === now.hour() && date[4] < now.minutes() - 2) {
      return `Был в сети ${date[3]}:${date[4] > 9 ? date[4] : `0${date[4]}`}`;
    } else if (date[3] === now.hour() && date[4] >= now.minutes() - 2) {
      return "online";
    }
  } else {
    return "Неизвестно";
  }
};
