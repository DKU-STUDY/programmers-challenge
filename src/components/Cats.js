export const Search = class {

  #state; #target;

  constructor (target) {
    this.#target = target;
    this.setState({
      cats: []
    });
  }

  #render () {
    const { cats } = this.#state;
    this.#target.innerHTML = cats.map((cat) => `
      <article><img src="${cat.url}" /></article>
    `).join('');
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