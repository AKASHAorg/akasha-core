import LRU from 'lru-cache';

export const contextCache = new LRU({ max: 6000, maxAge: 1000 * 60 * 40 });
