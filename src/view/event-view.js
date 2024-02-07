import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import createSelectedOffersTemplate from '../template/selected-offers-template.js';

import {
  getTypeOffers,
  getDestinationName,
  getSelectedOffers,
} from '../utils/point.js';

import {
  humanizePointDateTime,
  humanizePointDateDate,
  humanizePointDateTimeType,
  humanizePointTimeDate,
  getFormattedDiffDuration,
} from '../utils/date.js';

const createEventViewTemplate = (point) => {
  if (!point) {
    return;
  }

  const {
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destinationName,
    favoriteClassName,
    selectedOffers,
    hasSelectedOffers,
  } = point;

  const selectedOffersTemplate = createSelectedOffersTemplate(
    hasSelectedOffers,
    selectedOffers
  );

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizePointDateTime(dateFrom)}">${humanizePointDateDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${humanizePointDateTimeType(dateFrom)}">${humanizePointTimeDate(dateFrom)}</time>
            —
            <time class="event__end-time" datetime="${humanizePointDateTimeType(dateTo)}">${humanizePointTimeDate(dateTo)}</time>
          </p>
          <p class="event__duration">${getFormattedDiffDuration(dateTo, dateFrom)}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>

         ${selectedOffersTemplate}

        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class EventView extends AbstractStatefulView {
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, destinations, offers, onEditClick, onFavoriteClick }) {
    super();

    this._setState(EventView.parsePointToState(point, destinations, offers));

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventViewTemplate(this._state);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  static parsePointToState(point, destinations, offers) {
    const destinationName = getDestinationName(point.destination, destinations);
    const favoriteClassName = point.isFavorite
      ? 'event__favorite-btn--active'
      : '';
    const typeOffers = getTypeOffers(point.type, offers);
    const selectedOffers = getSelectedOffers(typeOffers, point.offers);
    const hasSelectedOffers = Boolean(selectedOffers.length);

    return {
      ...point,
      destinationName,
      favoriteClassName,
      typeOffers,
      selectedOffers,
      hasSelectedOffers,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.destinationName) {
      point.destinationName = null;
    }

    if (!point.favoriteClassName) {
      point.favoriteClassName = null;
    }

    if (!point.typeOffers) {
      point.typeOffers = null;
    }

    if (!point.selectedOffers) {
      point.selectedOffers = null;
    }

    if (!point.hasSelectedOffers) {
      point.hasSelectedOffers = null;
    }

    delete point.destinationName;
    delete point.favoriteClassName;
    delete point.typeOffers;
    delete point.selectedOffers;
    delete point.hasSelectedOffers;

    return point;
  }
}
