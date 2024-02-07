import AbstractView from '../framework/view/abstract-view.js';
import { getTotalPrice, getRoute, getRouteDuration } from '../utils/point.js';

function createInfoViewTemplate({ totalPrice, route, routeDuration }) {
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${routeDuration}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
}

export default class InfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({ points, destinations, offers }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    if (this.#points.length === 0 || this.#destinations.length === 0) {
      return '<div></div>';
    }

    return createInfoViewTemplate({
      isEmpty: false,
      totalPrice: getTotalPrice(this.#points, this.#offers),
      route: getRoute(this.#points, this.#destinations),
      routeDuration: getRouteDuration(this.#points),
    });
  }
}
