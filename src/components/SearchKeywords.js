export const SearchKeywords = class {

  #state; #target;

  constructor (target) {
    this.#target = target;
    this.setState({
      keywords: [],
      selectedIndex: -1,
      isOpened: false,
      isKeywordsLoading: false,
      get selectedKeyword () {
        const { keywords, selectedIndex } = this;
        return selectedIndex !== -1 ? keywords[selectedIndex] : null;
      }
    });
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

  }

  setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
    this.#event();
  }
}