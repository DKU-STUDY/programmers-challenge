import {debounce, eventBus} from "../utils/index.js";

export const SearchInput = class {

  #target; #props;

  constructor (target, props) {
    this.#target = target;
    this.#props = props;
    this.#event();
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
        this.#props.search(target.value);
      }

    });
  }

  setValue (value) {
    this.#target.value = value;
  }
}