import {selectOne} from "./utils/index.js";
import {Cats} from './components/Cats.js';
import {SearchLoading} from "./components/SearchLoading.js";
import {Message} from "./components/Message.js";
import {SearchKeywords} from "./components/SearchKeywords.js";
import {SearchInput} from "./components/SearchInput.js";
import {fetchCats} from "./adapter/CatAdapter";
import {searchService} from "./services";

class App {
  #components;

  constructor() {
    const searchLoading = new SearchLoading();
    const searchProps = {
      search: () => this.search(),
      select: () => this.select(),
      closeRecommend: () => this.closeRecommend(),
      openRecommend: () => this.openRecommend(),
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

  select (increment) { this.#components.searchKeywords.select(increment); }
  openRecommend (query) { this.#components.searchKeywords.open(query); }
  closeRecommend () { this.#components.searchKeywords.close(); }

  async search (query) {
    const { searchLoading, searchKeywords, cats, searchInput } = this.#components;
    if (searchLoading.getIsLoading()) return;
    const searchQuery = searchKeywords.getSelectedIndex() !== -1
                          ? searchKeywords.getSelected()
                          : query;
    this.closeRecommend();
    this.searchLoading();
    cats.search(searchQuery);
  }

  searchLoading () { this.#components.searchLoading.loading(); }
  searchLoaded () { this.#components.searchLoading.loaded(); }
}

window.onload = () => new App();