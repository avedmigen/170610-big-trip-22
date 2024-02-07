import { changeToDashesLowercase } from '../utils/point';

const createOffersSectionTemplate = (
  typeOffers,
  pointOffersIds,
  isDisabled,
) => {
  if (!typeOffers || typeOffers.length === 0) {
    return '';
  }

  const eventOffersTemplate = `
  <section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${typeOffers
    .map(
      (offer) => `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${changeToDashesLowercase(offer.title)}-${offer.id}"
            type="checkbox"
            name="event-offer-${changeToDashesLowercase(offer.title)}"
            data-offer-id="${offer.id}"
            ${pointOffersIds.includes(offer.id) ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}
          >
          <label for="event-offer-${changeToDashesLowercase(offer.title)}-${offer.id}" class="event__offer-label">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `,
    )
    .join('')}
    </div>
  </section>
`;

  return eventOffersTemplate;
};

export default createOffersSectionTemplate;
