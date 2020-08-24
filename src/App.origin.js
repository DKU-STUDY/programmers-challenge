import { selectOne } from "./utils/index.js";
import { Cats } from './components/Cats.js';

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");

window.onload = () => {
  new Cats($searchResults);
}