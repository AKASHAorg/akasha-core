const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.ethereum.world'
    : 'https://moderation.akasha.network';

export const BASE_DECISION_URL = `${BASE_URL}/decisions`;
export const BASE_FLAG_URL = `${BASE_URL}/flags`;
