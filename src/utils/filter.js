import { FilterType } from '../const.js';

import { isEventFuture, isEventPresent, isEventPast } from './date.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isEventFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) => isEventPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) =>
    points.filter((point) => isEventPast(point.dateTo)),
};
export { filter };
