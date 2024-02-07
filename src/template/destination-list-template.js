const createDestinationListTemplate = (
  hasPointType,
  destinations,
  destinationId,
) => {
  if (!hasPointType) {
    return '';
  }

  return `<datalist id="destination-list-${destinationId}">
    ${destinations.map(({ name }) => `<option value="${name}"</option>`).join('')}
   </datalist>`;
};

export default createDestinationListTemplate;
