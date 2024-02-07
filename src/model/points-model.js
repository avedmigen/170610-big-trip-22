import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor({ pointsApiService, destinationsModel, offersModel }) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init(),
      ]);
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT, { error: err });
    }
    this._notify(UpdateType.INIT);
  }

  async addPoint(updateType, update) {
    const response = await this.#pointsApiService.addPoint(update);
    const newPoint = this.#adaptToClient(response);

    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  async deletePoint(updateType, update) {
    const pointIndex = this.#points.findIndex(
      (point) => point.id === update.id,
    );

    await this.#pointsApiService.deletePoint(update);
    this.#points = [
      ...this.#points.slice(0, pointIndex),
      ...this.#points.slice(pointIndex + 1),
    ];
    this._notify(updateType);
  }

  async updatePoint(updateType, update) {
    const pointIndex = this.#points.findIndex(
      (point) => point.id === update.id,
    );
    const response = await this.#pointsApiService.updatePoint(update);
    const updatedPoint = this.#adaptToClient(response);

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];
    this._notify(updateType, updatedPoint);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
