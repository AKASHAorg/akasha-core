const BASE_URL = process.env.MODERATION_API || 'https://staging-moderation.ethereum.world';

const BASE_FLAG_URL = `${BASE_URL}/flags`;
const BASE_STATUS_URL = `${BASE_URL}/status`;
const BASE_DECISION_URL = `${BASE_URL}/decisions`;
const BASE_MODERATOR_URL = `${BASE_URL}/moderators`;

export default { BASE_FLAG_URL, BASE_STATUS_URL, BASE_DECISION_URL, BASE_MODERATOR_URL };
