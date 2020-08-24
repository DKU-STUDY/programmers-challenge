import { eventBus, selectAll} from "../utils";
import { fetchKeywords } from "../adapter/CatAdapter.js";
import { keywordsService } from "../services/index.js";

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

    eventBus.$on('openRecommend', this.#open);
    eventBus.$on('closeRecommend', this.#close);
  }

  #render () {
    const { keywords, selectedIndex, isOpened, isKeywordsLoading } = this.#state;
    this.#target.style.display =  isOpened ? 'block' : '';
    this.#target.innerHTML =
      isKeywordsLoading     ? `<div class="keywordLoading">추천 검색어 로딩 중</div>`       :
      keywords.length === 0 ? `<div class="keywordLoading">관련된 검색어가 없습니다.</div>` :
      `
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
    window.addEventListener('click', this.#close);
  }

  #open = async query => {
    if (this.#state.isKeywordsLoading) {
      this.#abortController.abort();
    }
    this.#setState({ isKeywordsLoading: true, isOpened: true, selectedKey: -1 });
    try {
      const keywords = await fetchKeywords(query);
      keywordsService.set(query, keywords);
      this.#setState({ keywords, isKeywordsLoading: false });
    } catch (e) {
      this.#setState({ isKeywordsLoading: false });
      eventBus.$emit('message', {
        type: 'error',
        text: '검색어 키워드를 가져오는 도중 에러가 발생하였습니다.',
      });
    }
  }

  #close = () => {
    this.#setState({ isOpened: false });
    window.removeEventListener('click', this.#close);
  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
    this.#event();
  }
}