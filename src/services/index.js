import store from "../storage/index.js";

const createService = STORE_KEY => {
  return Object.freeze({
    fetchAll () {
      return store.get(STORE_KEY) || {};
    },

    update (keywords) {
      store.set(STORE_KEY, keywords);
    },

    set (key, value) {
      const keywords = this.fetchAll();
      keywords[key] = value;
      this.update(keywords);
    },

    get (key) {
      const keywords = this.fetchAll();
      return keywords[key];
    },
  });
}

export const keywordsService = createService('%KEYWORDS%');
export const searchService = createService('%SEARCH%');