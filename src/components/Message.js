import { eventBus } from "../utils/index.js";

export const Message = class {

  #state; #target;

  constructor () {
    this.#target = document.createElement('div');
    this.#target.classList.add('messages');
    this.#setState({
      type: null,
      text: null,
    });

    eventBus.$on('message', ({ type, text }) => this.#setState({ type, text }));
  }

  #render () {
    const { type, text } = this.#state;
    const target = this.#target;

    if (target.parentNode === null) {
      document.body.appendChild(target);
    }

    const message = document.createElement('div');
    message.classList.add(type);
    message.innerHTML = text;
    target.appendChild(message);
    setTimeout(() => {
      message.remove();
      if (target.childElementCount === 0) {
        target.remove();
      }
    }, 2000);

  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
  }
}