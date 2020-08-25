import {selectOne} from "./utils/index.js";
import {Cats} from './components/Cats.js';
import {SearchLoading} from "./components/SearchLoading.js";
import {Message} from "./components/Message.js";
import {SearchKeywords} from "./components/SearchKeywords.js";
import {SearchInput} from "./components/SearchInput.js";

class App {
  #components;

  constructor() {
    const searchLoading = new SearchLoading();
    const searchProps = {
      search: () => this.search(),
      select: () => this.select(),
    };
    const catsProps = {
      loading: () => this.searchLoading(),
      loaded: () => this.searchLoaded(),
    }
    this.#components = {
      searchLoading,
      message: new Message(),
      searchInput: new SearchInput(selectOne(".keyword"), { ...searchProps }),
      searchKeywords: new SearchKeywords(selectOne(".keywords"), { ...searchProps }),
      cats: new Cats(selectOne(".search-results"), { ...catsProps }),
    };
  }

  select () {}
  search () {}
  searchLoading () {}
  searchLoaded () {}
}

window.onload = () => new App();