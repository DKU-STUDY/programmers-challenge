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


    if (messagesTag.parentNode === null) {
      document.body.appendChild(messagesTag);
    }
    const message = document.createElement('div');
    message.classList.add('error');
    message.innerHTML = e;
    messagesTag.appendChild(message);
    setTimeout(() => {
      message.remove();
      if (messagesTag.childElementCount === 0) {
        messagesTag.remove();
      }
    }, 2000);

  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
  }
}