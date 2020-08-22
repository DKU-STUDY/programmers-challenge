import { KEYWORDS_PATH, SEARCH_PATH } from "../constant/index.js";

export const fetchKeywords = async query => {
  try {
    const response = await fetch(`${KEYWORDS_PATH}/?q=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (e) {
    throw new Error(e);
  }
}
export const fetchCats = async query => {
  try {
    const response = await fetch(`${SEARCH_PATH}/q=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (e) {
    throw new Error(e);
  }
}