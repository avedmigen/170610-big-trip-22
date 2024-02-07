export default class DestinationsModel {
  #destinationsApiService = null;
  #destinations = [];

  constructor({ destinationsApiService }) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
