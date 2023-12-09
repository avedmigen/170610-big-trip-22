import { createElement } from '../render.js';
import { humanizePointInputDateTimeType } from '../utils.js';

const BLANK_POINT = {
  'id': '',
  'base_price': 0,
  'date_from': '',
  'date_to': '',
  'destination': '',
  'is_favorite': false,
  'offers': [],
  'type': ''
};

const createEventEditViewTemplate = (point, destinations, offers) => {

  const {
    id: pointId,
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destination: pointDestinationId,
    offers: pointOffersIds,
  } = point;

  const pointTypeOffers = offers
    .find(({ type }) => type === pointType)
    ?.offers;

  const toUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const createTypeListTemplate = () => (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${offers.map(({ type }, index) =>
      `<div class="event__type-item">
        <input
          id="event-type-${type}-${index}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${type === pointType ? 'checked' : ''}>
        <label
          class="event__type-label event__type-label--${type}"
          for="event-type-${type}-${index}">
            ${toUpperCaseFirstLetter(type)}
        </label>
          </div>`
    ).join('')}

      </fieldset >
  </div > `
  );

  const typeListTemplate = createTypeListTemplate();

  const pointDestinationName = destinations
    .find(({ id }) => id === pointDestinationId)
    ?.name;

  const createDestinationListTemplate = () => (
    `<datalist id="destination-list-${pointDestinationId}">
      ${destinations.map(({ name }) =>
      `<option value="${name}"</option>`
    ).join('')}
     </datalist > `
  );

  const destinationListTemplate = createDestinationListTemplate();

  const pointDestination = destinations
    .find(({ id }) => id === pointDestinationId);

  const hasDestinationDescription = Object.keys(pointDestination).some((key) => key === 'description');

  const pointDestinationDescription = pointDestination.description;

  const createDestinationDescriptionTemplate = () => (
    `${hasDestinationDescription ? `
      <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestinationDescription}</p>
        </section>
      </section>
    ` : ''} `
  );

  const destinationDescriptionTemplate = createDestinationDescriptionTemplate();

  const hasPointOffers = Boolean(pointOffersIds.length);

  const createOffersSectionTemplateTemplate = () => (
    `${hasPointOffers ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">

      ${pointTypeOffers.map(({ id, title, price }) => {

      const offerLastWord = title.split(' ').pop();
      const checked = pointOffersIds.includes(id) ? 'checked' : '';

      return `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offerLastWord}-${id}"
              type="checkbox"
              name="event-offer-${offerLastWord}"
              ${checked}
            >
            <label class="event__offer-label"
              for="event-offer-${offerLastWord}-${id}">
              <span class="event__offer-title">${title}</span>
              +€&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
        </div>`;
    }).join('')}
          </div>
      </section>
    ` : ''} `
  );

  const offersSectionTemplate = createOffersSectionTemplateTemplate();


  return (
    `<li class="trip-events__item" >
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">

            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>

            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

              ${typeListTemplate}

          </div>

          <div class="event__field-group  event__field-group--destination">

            <label class="event__label  event__type-output" for="event-destination-${pointDestinationId}">
              ${pointType}
            </label>

            <input
              class="event__input  event__input--destination"
              id="event-destination-${pointDestinationId}"
              type="text"
              name="event-destination"
              value="${pointDestinationName}"
              list="destination-list-${pointDestinationId}">

              ${destinationListTemplate}

          </div>

          <div class="event__field-group  event__field-group--time">

            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>

            <input
              class="event__input event__input--time"
              id="event-start-time-${pointId}"
              type="text"
              name="event-start-time"
              value="${humanizePointInputDateTimeType(dateFrom)}">
              —
              <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${pointId}"
                type="text"
                name="event-end-time"
                value="${humanizePointInputDateTimeType(dateTo)}">
              </div>

              <div class="event__field-group event__field-group--price">
                <label class="event__label" for="event-price-${pointId}">
                  <span class="visually-hidden">Price</span>
                  €
                </label>
                <input
                  class="event__input event__input--price"
                  id="event-price-${pointId}"
                  type="text"
                  name="event-price"
                  value="${basePrice}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>

            <section class="event__details">

              ${offersSectionTemplate}

              ${destinationDescriptionTemplate}

          </form>
        </>`
  );
};

export default class EventEditView {

  constructor({ point = BLANK_POINT }, { destinations }, { offers }) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createEventEditViewTemplate(
      this.point,
      this.destinations,
      this.offers,
    );
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
