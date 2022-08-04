import { EntityTypes, ModerationItemTypes } from '@akashaorg/typings/ui';

const BASE_URL = process.env.MODERATION_API;

export const BASE_DECISION_URL = `${BASE_URL}/decisions`;
export const BASE_REPORT_URL = `${BASE_URL}/reports`;

export const ITEM_TYPE_CONVERTER = {
  [ModerationItemTypes.POST]: EntityTypes.ENTRY,
  [ModerationItemTypes.REPLY]: EntityTypes.COMMENT,
  [ModerationItemTypes.ACCOUNT]: EntityTypes.PROFILE,
};
