export const SearchInput = class {

  #state; #target;

  constructor (target) {
    this.#target = target;
    this.setState();
  }

  #render () {

  }

  #event () {

  }

  setState (args) {
    this.#state = {
      ...this.#state,
      ...args
    };
    this.#render();
    this.#event();
  }
}