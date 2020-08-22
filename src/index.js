import { selectAll, selectOne, debounce } from "./utils/index.js";
import { KEYWORDS_PATH, SEARCH_PATH } from "./constant/index.js";

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

$keywords.addEventListener('click', e => {
  e.stopPropagation();
  state.selectedKey = [ ...selectAll('li', $keywords) ].indexOf(e.target);
  $keyword.value = state.selected;
  search();
})

$keyword.addEventListener("input", ({ target: { value } }) => {
  if (value.length === 0) return;
  debounce(openRecommend(value), 200);
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
  state.isKeywordsLoading = true;
  fetch(`${KEYWORDS_PATH}?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(keywords => {
      state.isKeywordsLoading = false;
      if (!(keywords instanceof Array)) {
        keywords = [];
      }
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
    })
    .catch(console.log);
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
  closeRecommend();
  searchLoading();
  fetch(`${SEARCH_PATH}?q=${query}`)
    .then((res) => res.json())
    .then((results) => {
      searchLoaded();
      if (!results.data) return;
      $searchResults.innerHTML = results.data
        .map((cat) => `<article><img src="${cat.url}" /></article>`)
        .join("");
    });
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