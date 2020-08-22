import { selectOne } from "./utils";
import { API_DOMAIN } from "./constant";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");

$keyword.addEventListener("keyup", ({ target, key }) => {
  const { value } = target;

  if (key === "Enter") {
    fetch(`${API_DOMAIN}/dev/api/cats/search?q=${value}`)
      .then((res) => res.json())
      .then((results) => {
        if (results.data) {
          $searchResults.innerHTML = results.data
            .map((cat) => `<article><img src="${cat.url}" /></article>`)
            .join("");
        }
      });
  }
});
