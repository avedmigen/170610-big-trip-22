export default class OffersModel {
  #offersApiService = null;
  #offers = [];

  constructor({ offersApiService }) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch (err) {
      this.#offers = [];
    }
  }
}
