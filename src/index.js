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

$keyword.addEventListener("input", ({ target }) => {
  if (target.value.length === 0) return;
  fetch(`${KEYWORDS_PATH}?q=${encodeURIComponent(target.value)}`)
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
    })
    .catch(console.log);
})

$keyword.addEventListener("keyup", ({ target, key}) => {
  const { value } = target;

  if (['ArrowUp', 'ArrowDown'].includes(key)) move(key);
  if (key === 'Escape') close();
  if (key === 'Enter') search(value);
});

const close = () => {
  $keywords.style.display = '';
  state.isOpened = false;
  state.selectedKey = -1;
}

const search = inputQuery => {
  let query = inputQuery;
  if (state.selectedKey !== -1) {
    query = state.selected;
    $keyword.value = query;
  }
  close();
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