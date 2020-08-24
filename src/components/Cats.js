import { eventBus } from "../utils/index.js";
import {fetchCats} from "../adapter/CatAdapter";
import {searchService} from "../services";

export const Cats = class {

  #state; #target; #searchLoadingTag;

  constructor (target) {
    this.#target = target;
    this.#searchLoadingTag = document.createElement('div');
    this.#searchLoadingTag.classList.add('searchLoading');
    this.#setState({
      cats: [],
      isSearchLoading: false,
    });

    eventBus.$on('searchCats', this.#search);
  }

  #render () {
    const { cats } = this.#state;
    this.#target.innerHTML = cats.map((cat) => `
      <article>
        <img src="${cat.url}" />
      </article>
    `).join('');
  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
  }

  #search = async query => {
    eventBus.$emit('searchLoading');
    try {
      const cats = await fetchCats(query);
      searchService.set(query, cats);
      this.#setState({ cats })
    } catch (e) {
      eventBus.$emit('searchLoaded');
      eventBus.$emit('message', {
        type: 'error',
        text: '검색하는 도중 에러가 발생하였습니다.'
      });
    }
  }
}