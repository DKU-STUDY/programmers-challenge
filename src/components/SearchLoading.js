import { eventBus } from "../utils/index.js";

export const SearchLoading = class {

  #state; #target;

  constructor () {
    this.#target = document.createElement('div');
    this.#target.classList.add('searchLoading');
    this.#setState({
      isSearchLoading: false,
    });

    eventBus.$on('searchLoading', () => this.#setState({ isSearchLoading: true }));
    eventBus.$on('searchLoaded', () => this.#setState({ isSearchLoading: false }));
    eventBus.$on('getIsSearchLoading', resolve => resolve(this.#state.isSearchLoading));
  }

  #render () {
    const { isSearchLoading } = this.#state;
    isSearchLoading
      ? document.body.appendChild(this.#target)
      : this.#target.remove();
  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
  }
}