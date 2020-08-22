import { KEYWORDS_PATH, SEARCH_PATH } from "../constant/index.js";
import { keywordsService, searchService } from "../services/index.js";

export const fetchKeywords = async query => {
  try {
    const cacheData = keywordsService.get(query);
    if (cacheData) return cacheData;
    const response = await fetch(`${KEYWORDS_PATH}/?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    keywordsService.set(query, result);
    return result;
  } catch (e) {
    throw new Error(e);
  }
}
export const fetchCats = async query => {
  try {
    const cacheData = searchService.get(query);
    if (cacheData) return cacheData;
    const response = await fetch(`${SEARCH_PATH}/?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    searchService.set(query, result);
    return result;
  } catch (e) {
    throw new Error(e);
  }
}