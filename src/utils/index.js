export const selectOne = (selector, parent = document) => parent.querySelector(selector);
export const selectAll = (selector, parent = document) => parent.querySelectorAll(selector);
export const debounce = (() => {
  let timer = null;
  return (callback, debounceTime) => {
    clearTimeout(timer);
    timer = setTimeout(callback, debounceTime);
  }
})();