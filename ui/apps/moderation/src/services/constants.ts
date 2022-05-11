import { ModerationItemTypes } from '@akashaorg/ui-awf-typings';
import { ItemTypes } from '@akashaorg/ui-awf-typings/lib/app-loader';

const BASE_URL = process.env.MODERATION_API;

export const BASE_DECISION_URL = `${BASE_URL}/decisions`;
export const BASE_REPORT_URL = `${BASE_URL}/reports`;

export const ITEM_TYPE_CONVERTER = {
  [ModerationItemTypes.POST]: ItemTypes.ENTRY,
  [ModerationItemTypes.REPLY]: ItemTypes.COMMENT,
  [ModerationItemTypes.ACCOUNT]: ItemTypes.PROFILE,
};
