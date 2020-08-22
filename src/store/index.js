export default Object.freeze({
  get (key) {
    return JSON.parse(sessionStorage.getItem(key) || 'null');
  },

  set (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
})