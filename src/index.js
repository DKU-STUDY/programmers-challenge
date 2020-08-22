import {selectOne} from "./utils/index.js";
import {KEYWORDS_PATH, SEARCH_PATH} from "./constant/index.js";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");

$keyword.addEventListener("input", ({ target }) => {
  fetch(`${KEYWORDS_PATH}?q=${encodeURIComponent(target.value)}`)
    .then(res => res.json())
    .then(keywords => {
      if (keywords.length === 0) return;
      $keywords.innerHTML = `
        <ul>
          ${keywords.map(key => `
            <li>${key}</li>
          `).join('')}
        </ul>
      `;
      $keywords.style.display = 'block';
    })
    .catch(console.log);
})

$keyword.addEventListener("keyup", ({ target, key }) => {
  const { value } = target;

  if (key === 'Escape') close();
  if (key === 'Enter') search(value);
});

const close = () => {
  $keywords.style.display = '';
}

const search = query => {
  fetch(`${SEARCH_PATH}?q=${query}`)
    .then((res) => res.json())
    .then((results) => {
      if (results.data) {
        $searchResults.innerHTML = results.data
          .map((cat) => `<article><img src="${cat.url}" /></article>`)
          .join("");
      }
    });
}