import { eventBus } from "../utils/index.js";

export const SearchLoading = class {

  #state; #target;

  constructor () {
    this.#target = document.createElement('div');
    this.#target.classList.add('searchLoading');
    this.#setState({
      isSearchLoading: false,
    });

    eventBus.$on('searchLoading', this.#searchLoading);
    eventBus.$on('searchLoaded', this.#searchLoaded);
  }

  #render () {
    const { isSearchLoading } = this.#state;
    isSearchLoading
      ? document.body.appendChild(this.#target)
      : this.#target.remove();
  }

  #setState (args) {
    this.#state = {
      ...this.#state,
      ...args
    };
    this.#render();
  }

  #searchLoading () {
    this.#setState({ isSearchLoading: true });
  }

  #searchLoaded () {
    this.#setState({ isSearchLoading: false });
  }
}