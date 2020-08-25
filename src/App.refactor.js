import { selectOne } from "./utils/index.js";
import { Cats } from './components/Cats.js';
import { SearchLoading } from "./components/SearchLoading.js";
import { Message } from "./components/Message.js";
import { SearchKeywords } from "./components/SearchKeywords.js";
import { SearchInput } from "./components/SearchInput.js";

class App {
  #components;

  constructor() {

    const $searchInput = selectOne(".keyword");
    const $searchKeywords = selectOne(".keywords");
    const $searchResults = selectOne(".search-results");

    new SearchLoading();
    new Message();
    new SearchInput($searchInput);
    new SearchKeywords($searchKeywords);
    new Cats($searchResults);
  }

  search () {

  }
}

window.onload = () => new App();