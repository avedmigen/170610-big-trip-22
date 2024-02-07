import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import createTypeListTemplate from '../template/type-list-template.js';
import createDestinationListTemplate from '../template/destination-list-template.js';
import createDestinationPhotosTemplate from '../template/destination-photos-template.js';
import createDestinationDescriptionTemplate from '../template/destination-description-template.js';
import createOffersSectionTemplate from '../template/offers-section-template.js';
import { BLANK_POINT, commonDatepickerConfig } from '../const.js';

import {
  getDestinationName,
  getTypeOffers,
  getDestinationPhotos,
  getFullDestination,
} from '../utils/point.js';

import { humanizePointInputDateTimeType } from '../utils/date.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEventEditViewTemplate = (
  point,
  destinations,
  offers,
  isNewPoint
) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destination: destinationId,
    offers: pointOffersIds,
    hasPointType,
    destinationName,
    typeOffers,
    destinationDescription,
    hasDestinationDescription,
    destinationPhotos,
    hasDestinationPhotos,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const typeListTemplate = createTypeListTemplate(offers, pointType);
  const destinationListTemplate = createDestinationListTemplate(
    hasPointType,
    destinations,
    destinationId
  );
  const destinationPhotosTemplate = createDestinationPhotosTemplate(
    hasDestinationPhotos,
    destinationPhotos
  );
  const destinationDescriptionTemplate = createDestinationDescriptionTemplate(
    hasDestinationDescription,
    hasDestinationPhotos,
    destinationDescription,
    destinationPhotos,
    destinationPhotosTemplate
  );
  const offersSectionTemplate = createOffersSectionTemplate(
    typeOffers,
    pointOffersIds,
    isDisabled
  );

  const getCurrentButton = (isNew) => {
    if (isNew) {
      return 'Cancel';
    } else {
      const buttonLabel = isDeleting ? 'Deleting...' : 'Delete';
      return buttonLabel;
    }
  };

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${destinationId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${destinationId}" type="checkbox">
              ${typeListTemplate}
          </div>
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-${destinationId}">
              ${pointType}
            </label>
            <input class="event__input event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-${destinationId}" ${isDisabled ? 'disabled' : ''}>
              ${destinationListTemplate}
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${destinationId}">From</label>
            <input class="event__input event__input--time" id="event-start-time-${destinationId}" type="text" name="event-start-time" value="${humanizePointInputDateTimeType(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
              —
            <label class="visually-hidden" for="event-end-time-${destinationId}">To</label>
            <input class="event__input event__input--time" id="event-end-time-${destinationId}" type="text" name="event-end-time" value="${humanizePointInputDateTimeType(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${destinationId}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input event__input--price" id="event-price-${destinationId}" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset">
            ${getCurrentButton(isNewPoint)}
          </button>
          <button class="event__rollup-btn" type="button" ${isNewPoint ? 'style="display: none;"' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersSectionTemplate}
          ${destinationDescriptionTemplate}
        </section>
      </form>
    </li>`;
};

export default class EventEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;

  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;

  #isNewPoint = false;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    point = BLANK_POINT,
    destinations,
    offers,
    onFormSubmit,
    onCloseClick,
    onDeleteClick,
    isNewPoint = false,
  }) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;

    this._setState(
      EventEditView.parsePointToState(point, destinations, offers)
    );

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditViewTemplate(
      this._state,
      this.#destinations,
      this.#offers,
      this.#isNewPoint
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EventEditView.parsePointToState(point, this.#destinations, this.#offers)
    );
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
    this.element
      .querySelectorAll('.event__type-input')
      .forEach((inputElement) => {
        inputElement.addEventListener('click', (evt) => {
          this.#eventTypeInputClickHandler(evt);
        });
      });
    this.element
      .querySelector('.event__input')
      .addEventListener('change', this.#destinationInputChangeHandler);
    this.element
      .querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox) => {
        checkbox.addEventListener('change', (evt) =>
          this.#offerCheckboxChangeHandler(evt)
        );
      });
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  }

  #setDateFromDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        ...commonDatepickerConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
      }
    );
  }

  #setDateToDatepicker() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        ...commonDatepickerConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
      }
    );
  }

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(
      EventEditView.parseStateToPoint(
        this._state,
        this.#destinations,
        this.#offers
      )
    );
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToPoint(this._state));
  };

  #eventTypeInputClickHandler = (evt) => {
    evt.preventDefault();
    const type = evt.target.value;
    const typeOffers = getTypeOffers(type, this.#offers);

    this.updateElement({
      type,
      offers: [],
      typeOffers,
    });
  };

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();

    let previousValue = this._state.destinationName;
    let inputValue = evt.target.value;
    const inputCityName = inputValue.toLowerCase();
    const isValidCity = this.#destinations.some(
      (city) => city.name.toLowerCase() === inputCityName
    );

    if (!isValidCity) {
      inputValue = previousValue;
    } else {
      previousValue = inputValue;
    }

    evt.target.value = inputValue;

    const foundCity = this.#destinations.find(
      (city) => city.name === inputValue
    );

    const fullDestination = getFullDestination(
      foundCity.id,
      this.#destinations
    );
    const destinationDescription = fullDestination.description;
    const hasDestinationDescription = Boolean(fullDestination.description);

    const destinationPhotos = getDestinationPhotos(
      foundCity.id,
      this.#destinations
    );
    const hasDestinationPhotos = Boolean(destinationPhotos.length);

    this.updateElement({
      destination: foundCity.id,
      destinationName: foundCity.name,
      fullDestination,
      destinationDescription,
      hasDestinationDescription,
      destinationPhotos,
      hasDestinationPhotos,
    });
  };

  #priceInputChangeHandler = (evt) => {
    evt.preventDefault();
    let priceValue = Number(evt.target.value);

    if (priceValue < 0) {
      priceValue = Math.abs(priceValue);
      evt.target.value = priceValue;
    }

    if (!Number.isInteger(priceValue)) {
      priceValue = Math.trunc(priceValue);
      evt.target.value = priceValue;
    }

    this._setState({
      basePrice: priceValue,
    });
  };

  #offerCheckboxChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedBoxes = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked')
    );
    this._setState({
      offers: checkedBoxes.map((item) => item.dataset.offerId),
    });
  };

  static parsePointToState(point, destinations, offers) {
    const hasPointType = offers.some((offer) => offer.type === point.type);
    const destinationName = getDestinationName(point.destination, destinations);

    const typeOffers = getTypeOffers(point.type, offers);

    const fullDestination = getFullDestination(point.destination, destinations);
    const destinationDescription = fullDestination
      ? fullDestination.description
      : null;
    const hasDestinationDescription = Boolean(
      fullDestination && fullDestination.description
    );

    const destinationPhotos = getDestinationPhotos(
      point.destination,
      destinations
    );
    const hasDestinationPhotos = Boolean(
      destinationPhotos && destinationPhotos.length
    );

    return {
      ...point,
      hasPointType,
      destinationName,
      typeOffers,
      fullDestination,
      destinationDescription,
      hasDestinationDescription,
      destinationPhotos,
      hasDestinationPhotos,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.hasPointType) {
      point.hasPointType = null;
    }

    if (!point.destinationName) {
      point.destinationName = null;
    }

    if (!point.typeOffers) {
      point.typeOffers = null;
    }

    if (!point.fullDestination) {
      point.fullDestination = null;
    }

    if (!point.destinationDescription) {
      point.destinationDescription = null;
    }

    if (!point.hasDestinationDescription) {
      point.hasDestinationDescription = null;
    }

    if (!point.destinationPhotos) {
      point.destinationPhotos = null;
    }

    if (!point.hasDestinationPhotos) {
      point.hasDestinationPhotos = null;
    }

    delete point.hasPointType;
    delete point.destinationName;
    delete point.typeOffers;
    delete point.fullDestination;
    delete point.destinationDescription;
    delete point.hasDestinationDescription;
    delete point.destinationPhotos;
    delete point.hasDestinationPhotos;

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
