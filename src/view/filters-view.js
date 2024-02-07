import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, count } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  const isDisabled = count === 0 ? 'disabled' : '';

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        ${isChecked}
        ${isDisabled}
        value="${type}">
      <label
       class="trip-filters__filter-label"
       for="filter-${type}">${type}</label>
    </div>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  if (!filterItems || !filterItems.length) {
    return '';
  }

  const filterItemsMarkup = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
