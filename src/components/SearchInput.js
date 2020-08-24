import {debounce, eventBus} from "../utils/index.js";

export const SearchInput = class {

  #target;

  constructor (target) {
    this.#target = target;
    this.#event();
  }

  #event () {
    const target = this.#target;

    target.addEventListener("input", ({ target: { value } }) => {
      if (value.length === 0) return;
      debounce(() => eventBus.$emit('openRecommend', value), 200);
    })

    target.addEventListener("keyup", ({ target, key}) => {

      const { value } = target;

      if (['ArrowUp', 'ArrowDown'].includes(key)) {
        eventBus.$emit('selectKeyword', key === 'ArrowUp' ? -1 : 1);
      }
      if (key === 'Escape') {
        eventBus.$emit('closeRecommend')
      }
      if (key === 'Enter') {
        this.searchCats(value);
      }

    });
  }

  async searchCats (query) {
    const isSearchLoading = await new Promise(resolve => eventBus.$emit('getIsSearchLoading', resolve))
    if (isSearchLoading) return;

    eventBus.$emit('closeRecommend');
    eventBus.$emit('searchCats', query);
  }
}