const store = new Map();

const localStorageMock = {
  getItem(key: string) {
    return store.get(key);
  },
  setItem(key: string, value: string) {
    store.set(key, value);
  },
  clear() {
    store.clear();
  },
  removeItem(key: string) {
    store.delete(key);
  },
  getAll() {
    return Object.fromEntries(store);
  },
};

export { localStorageMock };
