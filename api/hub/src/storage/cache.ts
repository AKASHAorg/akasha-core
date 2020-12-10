import LRU from 'lru-cache';

export const contextCache = new LRU({ max: 6000, maxAge: 1000 * 60 * 40 });

export const queryCache = new LRU({ max: 2000, maxAge: 1000 * 60 * 60 * 24, updateAgeOnGet: true });
