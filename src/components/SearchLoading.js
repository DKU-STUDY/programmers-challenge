export const SearchLoading = class {

  #state; #target;

  constructor () {
    this.#target = document.createElement('div');
    this.#target.classList.add('searchLoading');
    this.#setState({
      isSearchLoading: false,
    });
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

  getIsLoading () { return this.#state.isSearchLoading; }
  loading () { this.#setState({ isSearchLoading: true }) }
  loaded () { this.#setState({ isSearchLoading: false }) }
}