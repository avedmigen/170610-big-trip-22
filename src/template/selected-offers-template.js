const createSelectedOffersTemplate = (hasSelectedOffers, selectedOffers) =>
  `${
    hasSelectedOffers
      ? `
          <ul class="event__selected-offers">
              ${selectedOffers
    .map(
      ({ title, price }) =>
        `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              +€
              <span class="event__offer-price">${price}</span>
            </li>`,
    )
    .join('')}
          </ul>`
      : ''
  }`;

export default createSelectedOffersTemplate;
