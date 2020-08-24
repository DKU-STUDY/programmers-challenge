export const SearchKeywords = class {

  #state; #target;

  constructor (target) {
    this.#target = target;
    this.setState({
      keywords: [],
      selectedIndex: -1,
      get selectedKeyword () {
        const { keywords, selectedIndex } = this;
        return selectedIndex !== -1 ? keywords[selectedIndex] : null;
      }
    });
  }

  #render () {

  }

  #event () {

  }

  setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
    this.#event();
  }
}