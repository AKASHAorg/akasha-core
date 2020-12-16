import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.AWF_SEARCH_ID, process.env.AWF_SEARCH_KEY);
export const searchIndex = client.initIndex(process.env.AWF_SEARCH_INDEX);
