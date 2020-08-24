import { selectOne } from "./utils/index.js";
import { Cats } from './components/Cats.js';
import { SearchLoading } from "./components/SearchLoading.js";
import { Message } from "./components/Message.js";
import { SearchKeywords } from "./components/SearchKeywords.js";
import { SearchInput } from "./components/SearchInput.js";

const $keyword = selectOne(".keyword");
const $keywords = selectOne(".keywords");
const $searchResults = selectOne(".search-results");

window.onload = () => {
  new SearchLoading();
  new Message();
  new SearchInput($keyword);
  new SearchKeywords($keywords);
  new Cats($searchResults);
}