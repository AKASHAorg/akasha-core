const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://moderation.ethereum.world'
    : 'https://moderation.akasha.network';

const BASE_FLAG_URL = `${BASE_URL}/flags`;
const BASE_STATUS_URL = `${BASE_URL}/status`;
const BASE_DECISION_URL = `${BASE_URL}/decisions`;

export default { BASE_FLAG_URL, BASE_STATUS_URL, BASE_DECISION_URL };
