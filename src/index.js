import {selectAll, selectOne} from "./utils/index.js";
import {KEYWORDS_PATH, SEARCH_PATH} from "./constant/index.js";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");
const state = {
  isOpened: false,
  selectedKey: -1,
  keywords: [],
  get selected () {
    return this.keywords[this.selectedKey];
  }
}

$keywords.addEventListener('click', e => {
  e.stopPropagation();
  state.selectedKey = [ ...selectAll('li', $keywords) ].indexOf(e.target);
  $keyword.value = state.selected;
  search();
})

$keyword.addEventListener("input", ({ target: { value } }) => {
  if (value.length === 0) return;
  openRecommend(value);
})

$keyword.addEventListener("keyup", ({ target, key}) => {
  const { value } = target;

  if (['ArrowUp', 'ArrowDown'].includes(key)) move(key);
  if (key === 'Escape') closeRecommend();
  if (key === 'Enter') search(value);
});

const openRecommend = query => {
  fetch(`${KEYWORDS_PATH}?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(keywords => {
      if (!(keywords instanceof Array) || keywords.length === 0) return;
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
  let query = $keyword.value;
  if (state.selectedKey !== -1) {
    query = state.selected;
    $keyword.value = query;
  }
  closeRecommend();
  fetch(`${SEARCH_PATH}?q=${query}`)
    .then((res) => res.json())
    .then((results) => {
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