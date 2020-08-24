import { selectOne } from "./utils/index.js";
import { Cats } from './components/Cats.js';
import { SearchLoading } from "./components/SearchLoading";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");

window.onload = () => {
  new SearchLoading();
  new Cats($searchResults);
}