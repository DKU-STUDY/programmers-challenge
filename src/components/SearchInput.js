import {debounce, eventBus} from "../utils/index.js";

export const SearchInput = class {

  #target; #props;

  constructor (target, props) {
    this.#target = target;
    this.#props = props;
    this.#event();
    this.#load();
    eventBus.$on('searchInputSubmit', query => this.#searchCats(query));
  }

  #event () {
    const target = this.#target;

    target.addEventListener("input", ({ target: { value } }) => {
      if (value.length === 0) return;
      debounce(() => eventBus.$emit('openRecommend', value), 200);
    })

    target.addEventListener("keyup", ({ target, key}) => {

      if (['ArrowUp', 'ArrowDown'].includes(key)) {
        this.#props.select(key === 'ArrowUp' ? -1 : 1);
      }

      if (key === 'Escape') {
        this.#props.closeRecommend();
      }

      if (key === 'Enter') {
        this.#searchCats(target.value);
      }

    });
  }

  async #searchCats (query) {
    const isSearchLoading = await new Promise(resolve => eventBus.$emit('getIsSearchLoading', resolve))
    if (isSearchLoading) return;

    eventBus.$emit('searchCats', query);
  }

  #load () {
    const query = location.search.replace(/^\?q=(.*)$/, '$1')
    if (query.length) {
      this.#target.value = decodeURIComponent(query);
      this.#searchCats(query);
    }
  }

  setValue (value) {
    this.#target.value = value;
  }
}