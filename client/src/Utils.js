import dayjs from "dayjs";

// TODO: L10n independent
const daysOfWeek = [
  "Lunedi",
  "Martedi",
  "Mercoledi",
  "Giovedi",
  "Venerdi",
  "Sabato",
  "Domenica",
];

/**
 * Given a list of menu availabilities, returns a new object where each key
 * is a specific day (within the availabilities) and the values are the availabilities
 * for that day
 */
function groupByDay(avail) {
  return avail.reduce((result, element) => {
    if (result[element.day] === undefined) result[element.day] = [];
    result[element.day].push(element);
    return result;
  }, {});
}

function groupByProduct(avail) {
  return avail.reduce((result, element) => {
    if (result[element.entry.name] === undefined)
      result[element.entry.name] = [];
    result[element.entry.name].push(element);
    return result;
  }, {});
}

function formatDayEntry(dayEntry) {
  return `
  ${daysOfWeek[dayjs(dayEntry).day()]} - 
  ${dayjs(dayEntry).format("DD/MM")}`;
}

export { daysOfWeek, groupByDay, groupByProduct, formatDayEntry };
