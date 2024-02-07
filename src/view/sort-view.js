import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortViewTemplate = (sortType) => {
  const sortItems = Object.values(SortType).map((type) => {
    const isDisabled = [SortType.EVENT, SortType.OFFERS].includes(
      type.toLowerCase()
    );
    const isChecked = type === sortType ? 'checked' : '';
    const isDisabledAttr = isDisabled ? 'disabled' : '';

    return `
      <div class="trip-sort__item  trip-sort__item--${type}">
        <input
          id="sort-${type}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${type}"
          data-sort-type="${type}"
          ${isChecked}
          ${isDisabledAttr}
        >
        <label
          class="trip-sort__btn"
          for="sort-${type}">${type}</label>
      </div>
    `;
  });

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.join('')}
    </form>
  `;
};

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortViewTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
