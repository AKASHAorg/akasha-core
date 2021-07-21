const BASE_URL = process.env.MODERATION_API;

const BASE_REPORT_URL = `${BASE_URL}/reports`;
const BASE_STATUS_URL = `${BASE_URL}/status`;
const BASE_DECISION_URL = `${BASE_URL}/decisions`;
const BASE_MODERATOR_URL = `${BASE_URL}/moderators`;
const BASE_REASONS_URL = `${BASE_URL}/reasons`;

export default {
  BASE_REPORT_URL,
  BASE_STATUS_URL,
  BASE_DECISION_URL,
  BASE_MODERATOR_URL,
  BASE_REASONS_URL,
};
