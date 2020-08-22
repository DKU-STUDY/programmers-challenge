import {debounce, selectAll, selectOne} from "./utils/index.js";
import {KEYWORDS_PATH, SEARCH_PATH} from "./constant/index.js";
import {keywordsService, searchService} from "./services/index.js";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");
const controller = new AbortController();
const state = {
  isOpened: false,
  isSearchLoading: false,
  isKeywordsLoading: false,
  selectedKey: -1,
  keywords: [],
  get selected () {
    return this.keywords[this.selectedKey];
  }
}

const searchLoadingTag = document.createElement('div');
searchLoadingTag.classList.add('searchLoading');

const messagesTag = document.createElement('div');
messagesTag.classList.add('messages');

$keywords.addEventListener('click', e => {
  e.stopPropagation();
  state.selectedKey = [ ...selectAll('li', $keywords) ].indexOf(e.target);
  $keyword.value = state.selected;
  search();
})

$keyword.addEventListener("input", ({ target: { value } }) => {
  if (value.length === 0) return;
  debounce(() => openRecommend(value), 200);
})

$keyword.addEventListener("keyup", ({ target, key}) => {
  const { value } = target;

  if (['ArrowUp', 'ArrowDown'].includes(key)) move(key);
  if (key === 'Escape') closeRecommend();
  if (key === 'Enter') search(value);
});

const openRecommend = query => {
  $keywords.innerHTML = `
    <div class="keywordLoading">추천 검색어 로딩 중</div>
  `;
  if (state.isKeywordsLoading) {
    controller.abort();
  }
  const cacheData = keywordsService.get(query);
  if (cacheData) {
    return keywordsRender(cacheData);
  }
  state.isKeywordsLoading = true;
  fetch(`${KEYWORDS_PATH}?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(keywords => {
      keywordsService.set(query, keywords);
      keywordsRender(keywords);
    })
    .catch(() => {
      state.isKeywordsLoading = false;
      errorMessage('검색어 키워드를 가져오는 도중 에러가 발생하였습니다.');
    });
}

const keywordsRender = keywords => {
  state.isKeywordsLoading = false;
  state.keywords = keywords;
  $keywords.innerHTML = `
    <ul>
      ${keywords.map(key => `
        <li>${key}</li>
      `).join('')}
    </ul>
  `;
  state.isOpened = true;
  state.selectedKey = -1;
  $keywords.style.display = 'block';
  if (keywords.length === 0) {
    $keywords.innerHTML = `
          <div class="keywordLoading">관련된 검색어가 없습니다.</div>
        `;
  }
  window.addEventListener('click', closeRecommend);
}

const closeRecommend = () => {
  $keywords.style.display = '';
  state.isOpened = false;
  state.selectedKey = -1;
  window.removeEventListener('click', closeRecommend);
}

const search = () => {
  if (state.isSearchLoading) return;
  let query = $keyword.value;
  if (state.selectedKey !== -1) {
    query = state.selected;
    $keyword.value = query;
  }
  const cacheData = searchService.get(query);
  if (cacheData) {
    return searchRender(cacheData, query);
  }
  closeRecommend();
  searchLoading();
  fetch(`${SEARCH_PATH}?q=${query}`)
    .then((res) => res.json())
    .then(results => {
      searchService.set(query, results);
      searchRender(results, query);
    })
    .catch(() => {
      searchLoaded();
      errorMessage('검색하는 도중 에러가 발생하였습니다.');
    });
}

const searchRender = (results, query) => {
  searchLoaded();
  if (!results.data) return;
  $searchResults.innerHTML = results.data
    .map((cat) => `<article><img src="${cat.url}" /></article>`)
    .join("");
  history.pushState({ q: query }, '', `${location.pathname}?q=${query}`);
}

const move = key => {
  const { isOpened, keywords, selectedKey } = state;
  const len = keywords.length;
  if (!isOpened) return;
  let newIndex = key === 'ArrowUp' ? selectedKey - 1 : selectedKey + 1;
  if (newIndex < 0) newIndex = len - 1;
  if (newIndex >= len) newIndex = 0;
  const els = selectAll('li', $keywords);
  els[selectedKey]?.classList.remove('active');
  els[newIndex].classList.add('active');
  state.selectedKey = newIndex;
}

const searchLoading = () => {
  document.body.appendChild(searchLoadingTag);
  state.isSearchLoading = true;
}

const searchLoaded = () => {
  searchLoadingTag.remove();
  state.isSearchLoading = false;
}

const errorMessage = e => {
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

window.onload = () => {
  const query = location.search.replace(/^\?q=(.*)$/, '$1')
  $keyword.value = decodeURIComponent(query);
  search();
}