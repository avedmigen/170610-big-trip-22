import {
  render,
  replace,
  remove,
  RenderPosition,
} from '../framework/render.js';
import InfoView from '../view/info-view.js';
import { sortByDay } from '../utils/point.js';

export default class InfoPresenter {
  #infoContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #infoComponent = null;

  constructor({ infoContainer, pointsModel, destinationsModel, offersModel }) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    return points;
  }

  get destinations() {
    const destinations = this.#destinationsModel.destinations;
    return destinations;
  }

  get offers() {
    const offers = this.#offersModel.offers;
    return offers;
  }

  init() {
    const points = this.points;
    const destinations = this.destinations;
    const offers = this.offers;
    const sortedPoints = points.sort(sortByDay);

    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new InfoView({
      points: sortedPoints,
      destinations: destinations,
      offers: offers,
    });

    if (prevInfoComponent === null) {
      render(
        this.#infoComponent,
        this.#infoContainer,
        RenderPosition.AFTERBEGIN,
      );
      return;
    }

    replace(this.#infoComponent, prevInfoComponent);
    remove(prevInfoComponent);

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
