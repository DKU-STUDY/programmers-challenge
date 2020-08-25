import {selectOne} from "./utils/index.js";
import {Cats} from './components/Cats.js';
import {SearchLoading} from "./components/SearchLoading.js";
import {Message} from "./components/Message.js";
import {SearchKeywords} from "./components/SearchKeywords.js";
import {SearchInput} from "./components/SearchInput.js";

class App {
  #components;

  constructor() {
    const searchMethod = () => this.search();
    const selectKeyword = () => this.selectKeyword();
    const searchLoading = new SearchLoading();
    const searchProps = { searchMethod, selectKeyword };
    this.#components = {
      searchLoading,
      message: new Message(),
      searchInput: new SearchInput(selectOne(".keyword"), { ...searchProps }),
      searchKeywords: new SearchKeywords(selectOne(".keywords"), { ...searchProps }),
      cats: new Cats(selectOne(".search-results"), {
        loading: searchLoading.loading,
        loaded: searchLoading.loaded,
      }),
    };
  }

  selectKeyword () {

  }

  search () {

  }
}

window.onload = () => new App();