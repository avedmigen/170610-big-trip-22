import { render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { sortByDay, sortByDuration, sortByBasePrice } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #errorLoadingComponent = new ErrorLoadingView();
  #sortComponent = null;
  #noEventComponent = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;
  #isErrorLoading = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({
    boardContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    onNewEventDestroy,
  }) {
    this.#boardContainer = boardContainer;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByBasePrice);
    }

    return filteredPoints;
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
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noEventComponent) {
      render(this.#eventsListComponent, this.#boardContainer);
      remove(this.#noEventComponent);
    }

    this.#newEventPresenter.init(this.destinations, this.offers);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, destinations, offers);
    this.#eventPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => this.#renderPoint(point, destinations, offers));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderNoEvents() {
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType,
    });
    render(this.#noEventComponent, this.#boardContainer);
  }

  #renderError() {
    this.#isLoading = false;
    this.#isErrorLoading = true;
    remove(this.#loadingComponent);
    render(this.#errorLoadingComponent, this.#boardContainer);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.#isErrorLoading) {
      this.#renderError();
      return;
    }
    const points = this.points;
    const destinations = this.destinations;
    const offers = this.offers;

    const pointCount = points.length;

    if (pointCount === 0) {
      render(this.#eventsListComponent, this.#boardContainer);
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventsListComponent, this.#boardContainer);
    this.#renderPoints(points, destinations, offers);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#errorLoadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#eventPresenters.get(update.id).setSaving();
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this.#newEventPresenter.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          this.#eventPresenters.get(update.id).setDeleting();
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch (err) {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#eventPresenters.get(update.id).setAborting();
          break;
        case UserAction.ADD_POINT:
          this.#newEventPresenter.setAborting();
          break;
        case UserAction.DELETE_POINT:
          this.#eventPresenters.get(update.id).setAborting();
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters
          .get(data.id)
          .init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if (data && data.error) {
          this.#renderError();
        } else {
          try {
            if (
              this.#destinationsModel.destinations.length === 0 ||
              this.#offersModel.offers.length === 0
            ) {
              this.#renderError();
              return;
            }
            this.#isLoading = false;
            remove(this.#loadingComponent);
            this.#renderBoard();
          } catch (error) {
            this.#renderError();
          }
        }
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ resetRenderedTaskCount: true });
    this.#renderBoard();
  };
}
