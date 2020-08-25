import { eventBus, selectAll} from "../utils/index.js";
import { fetchKeywords } from "../adapter/CatAdapter.js";
import { keywordsService } from "../services/index.js";

export const SearchKeywords = class {

  #state; #target; #props; #abortController;

  constructor (target, props) {
    this.#target = target;
    this.#props = props;
    this.#abortController = new AbortController();
    this.#setState({
      keywords: [],
      selectedIndex: -1,
      isOpened: false,
      isKeywordsLoading: false,
      get selectedKeyword () {
        const { keywords, selectedIndex } = this;
        return selectedIndex !== -1 ? keywords[selectedIndex] : null;
      },
    });

    eventBus.$on('openRecommend', this.#open);
    eventBus.$on('closeRecommend', this.#close);
    eventBus.$on('selectKeyword', this.#select);
  }

  #render () {
    const { keywords, selectedIndex, isOpened, isKeywordsLoading } = this.#state;
    this.#target.style.display =  isOpened ? 'block' : '';
    this.#target.innerHTML =
      isKeywordsLoading     ? `<div class="keywordLoading">추천 검색어 로딩 중</div>`       :
      keywords.length === 0 ? `<div class="keywordLoading">관련된 검색어가 없습니다.</div>` :
      `
        <ul>
          ${keywords.map((value, key) => `
            <li ${key === selectedIndex ? 'class="active"' : ''}>${value}</li>
          `).join('')}
        </ul>
      `;

  }

  #event () {
    this.#target.addEventListener('click', e => {
      e.stopPropagation();
      const selectedIndex = [ ...selectAll('li', this.#target) ].indexOf(e.target);
      this.#setState({ selectedIndex });
      eventBus.$emit('searchInputSubmit', this.#state.selectedKeyword);
    })
    window.addEventListener('click', this.#close);
  }

  #open = async query => {
    if (this.#state.isKeywordsLoading) {
      this.#abortController.abort();
    }
    this.#setState({ isKeywordsLoading: true, isOpened: true, selectedIndex: -1 });
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

  #select = increment => {
    const { keywords, selectedIndex, len = keywords.length } = this.#state;
    let newKey = selectedIndex + increment;
    if (newKey < 0) newKey = len - 1;
    if (newKey >= len) newKey = 0;
    this.#setState({ selectedIndex: newKey });
  }

  #setState (args) {
    this.#state = { ...this.#state, ...args };
    this.#render();
    this.#event();
  }
}