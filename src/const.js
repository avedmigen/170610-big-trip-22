const OFFERS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const BLANK_POINT = {
  'basePrice': 0,
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'isFavorite': false,
  'offers': [],
  'type': 'flight',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const Url = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const DESTINATIONS_ITEMS_COUNT = 3;

const commonDatepickerConfig = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  locale: {
    firstDayOfWeek: 1,
  },
  'time_24hr': true,
  allowInput: true,
};

const DASH_SEPARATOR = '&nbsp;&mdash;&nbsp;';

export {
  OFFERS_TYPES,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  BLANK_POINT,
  Method,
  Url,
  DESTINATIONS_ITEMS_COUNT,
  commonDatepickerConfig,
  DASH_SEPARATOR,
};
