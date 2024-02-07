import { toUpperCaseFirstLetter } from '../utils/point.js';

const createTypeListTemplate = (offers, pointType) =>
  `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${offers
    .map(
      ({ type }, index) =>
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
          </div>`,
    )
    .join('')}
      </fieldset >
    </div > `;

export default createTypeListTemplate;
