const createDestinationPhotosTemplate = (
  hasDestinationPhotos,
  destinationPhotos,
) =>
  `${
    hasDestinationPhotos
      ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destinationPhotos.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
      </div>
    </div>`
      : ''
  }`;

export default createDestinationPhotosTemplate;
