import { render } from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import InfoPresenter from './presenter/info-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api/points-api-service.js';

const AUTHORIZATION = 'Basic 1R21Y2xas~23s2D2p';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pageBodyElement = document.querySelector('.page-body');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({
  destinationsApiService: pointsApiService,
});

const offersModel = new OffersModel({
  offersApiService: pointsApiService,
});

const pointsModel = new PointsModel({
  pointsApiService: pointsApiService,
  destinationsModel,
  offersModel,
});

const filterModel = new FilterModel();

const pageHeaderElement = pageBodyElement.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFormElement = tripMainElement.querySelector(
  '.trip-controls__filters'
);

const pageMainElement = pageBodyElement.querySelector('.page-main');

const tripEventsSectionElement = pageMainElement.querySelector('.trip-events');

const infoPresenter = new InfoPresenter({
  infoContainer: tripMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFormElement,
  filterModel,
  pointsModel,
});

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSectionElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick,
});

newEventButtonComponent.element.disabled = true;

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;

  const pointsCount = pointsModel.points;

  if (pointsCount.length === 0) {
    boardPresenter.init();
  }
}

function handleNewEventButtonClick() {
  boardPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}

let isError = false;

infoPresenter.init();
filterPresenter.init();
render(newEventButtonComponent, tripMainElement);
boardPresenter.init();

new Promise(() => {
  pointsApiService.points
    .then(() => {
      pointsModel.init().finally(() => {
        newEventButtonComponent.element.disabled = isError;
        render(newEventButtonComponent, tripMainElement);
      });
    })
    .catch(() => {
      isError = true;
      pointsModel.init().finally(() => {
        newEventButtonComponent.element.disabled = isError;
        render(newEventButtonComponent, tripMainElement);
      });
    });
});
