import { selectOne } from "./utils/index.js";
import { Cats } from './components/Cats.js';
import { SearchLoading } from "./components/SearchLoading.js";
import { Message } from "./components/Message.js";
import { SearchKeywords } from "./components/SearchKeywords.js";
import { SearchInput } from "./components/SearchInput.js";

class App {
  #components;

  constructor() {
    const searchLoading = new SearchLoading();
    const searchProps = {
      search: () => this.search(),
      select: increment => this.select(increment),
      closeRecommend: () => this.closeRecommend(),
      openRecommend: query => this.openRecommend(query),
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

    this.#load();
  }

  select (increment) { this.#components.searchKeywords.select(increment); }
  openRecommend (query) { this.#components.searchKeywords.open(query); }
  closeRecommend () { this.#components.searchKeywords.close(); }
  searchLoading () { this.#components.searchLoading.loading(); }
  searchLoaded () { this.#components.searchLoading.loaded(); }

  async search (query) {
    const { searchLoading, searchKeywords, cats, searchInput } = this.#components;
    if (searchLoading.getIsLoading()) return;
    const searchQuery = searchKeywords.getSelectedIndex() !== -1
                          ? searchKeywords.getSelected()
                          : query;
    this.closeRecommend();
    this.searchLoading();
    searchInput.setValue(searchQuery);
    await cats.search(searchQuery);
    this.searchLoaded();
  }

  #load () {
    const query = location.search.replace(/^\?q=(.*)$/, '$1')
    if (query.length) {
      this.search(query);
    }
  }

}

window.onload = () => new App();