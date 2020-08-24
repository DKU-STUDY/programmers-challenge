import { eventBus } from "../utils/index.js";

export const Cats = class {

  #state; #target; #searchLoadingTag;

  constructor (target) {
    this.#target = target;
    this.#searchLoadingTag = document.createElement('div');
    this.#searchLoadingTag.classList.add('searchLoading');
    this.#setState({
      cats: []
    });

    eventBus.$on('searchCats', this.#search);
  }

  #render () {
    const { cats } = this.#state;
    this.#target.innerHTML = cats.map((cat) => `
      <article><img src="${cat.url}" /></article>
    `).join('');
  }

  #setState (args) {
    this.#state = {
      ...this.#state,
      ...args
    };
    this.#render();
  }

  #search = cats => {

  }

  #searchLoading () {
    document.body.appendChild(searchLoadingTag);
    state.isSearchLoading = true;
  }

  #searchLoaded () {
    searchLoadingTag.remove();
    state.isSearchLoading = false;
  }
}