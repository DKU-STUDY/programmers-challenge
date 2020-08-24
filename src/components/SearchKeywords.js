import {eventBus, selectAll} from "../utils";

export const SearchKeywords = class {

  #state; #target; #abortController;

  constructor (target) {
    this.#target = target;
    this.#abortController = new AbortController();
    this.#setState({
      keywords: [],
      selectedIndex: -1,
      isOpened: false,
      isKeywordsLoading: false,
      get selectedKeyword () {
        const { keywords, selectedIndex } = this;
        return selectedIndex !== -1 ? keywords[selectedIndex] : null;
      }
    });

    eventBus.$on('openRecommend', query => this.#open(query));
  }

  #render () {
    const { keywords, selectedIndex, isOpened, isKeywordsLoading } = this.#state;
    this.#target.style.display =  isOpened ? 'block' : '';
    this.#target.innerHTML = isKeywordsLoading
        ? `<div class="keywordLoading">추천 검색어 로딩 중</div>`
        : `
          <ul>
            ${keywords.map(key => `
              <li ${key === selectedIndex ? 'class="active"' : ''}>${key}</li>
            `).join('')}
          </ul>
        `;

  }

  #event () {
    this.#target.addEventListener('click', e => {
      e.stopPropagation();
      const selectedKey = [ ...selectAll('li', this.#target) ].indexOf(e.target);
      this.#setState({ selectedKey });
      eventBus.$emit('searchInputSubmit', this.#state.selectedKeyword);
    })
  }

  #open () {
    if (this.#state.isKeywordsLoading) {
      this.#abortController.abort();
    }
  }

  #close () {
    this.#setState({ isOpened: false });
  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
    this.#event();
  }
}