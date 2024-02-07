import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

dayjs.extend(isSameOrAfter);

const POINT_DATE_TIME_FORMAT = 'YYYY-MM-DD';
const POINT_DATE_DATE_FORMAT = 'MMM DD';
const POINT_TIME_FORMAT = 'HH:mm';
const POINT_DATE_TIME_TYPE_FORMAT = 'YYYY-MM-DDTHH:mm';
const POINT_INPUT_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

const humanizePointDateTime = (pointDate) =>
  pointDate ? dayjs(pointDate).format(POINT_DATE_TIME_FORMAT) : '';
const humanizePointDateDate = (pointDate) =>
  pointDate ? dayjs(pointDate).format(POINT_DATE_DATE_FORMAT) : '';
const humanizePointTimeDate = (pointDate) =>
  pointDate ? dayjs(pointDate).format(POINT_TIME_FORMAT) : '';
const humanizePointDateTimeType = (pointDate) =>
  pointDate ? dayjs(pointDate).format(POINT_DATE_TIME_TYPE_FORMAT) : '';
const humanizePointInputDateTimeType = (pointDate) =>
  pointDate ? dayjs(pointDate).format(POINT_INPUT_DATE_TIME_FORMAT) : '';

const getFormattedDiffDuration = (dateTo, dateFrom) => {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const minutes = durationInMinutes % 60;
  const hours = Math.floor(durationInMinutes / 60) % 24;
  const days = Math.floor(durationInMinutes / (60 * 24));

  const formatValue = (value) => (value < 10 ? `0${value}` : value);

  if (durationInMinutes < 60) {
    return `${formatValue(minutes)}M`;
  } else if (durationInMinutes < 60 * 24) {
    return `${formatValue(hours)}H ${formatValue(minutes)}M`;
  } else {
    return `${formatValue(days)}D ${formatValue(hours)}H ${formatValue(minutes)}M`;
  }
};

const compareDates = (dateA, dateB) =>
  dayjs(dateA).isBefore(dayjs(dateB)) ? -1 : 1;

const isEventFuture = (date) => dayjs(date).diff(dayjs()) > 0;

const isEventPresent = (dateFrom, dateTo) =>
  dayjs(dateFrom).diff(dayjs()) <= 0 && dayjs(dateTo).diff(dayjs()) >= 0;

const isEventPast = (date) => dayjs(date).diff(dayjs()) < 0;

export {
  humanizePointDateTime,
  humanizePointDateDate,
  humanizePointDateTimeType,
  humanizePointTimeDate,
  humanizePointInputDateTimeType,
  getFormattedDiffDuration,
  compareDates,
  isEventFuture,
  isEventPresent,
  isEventPast,
};
