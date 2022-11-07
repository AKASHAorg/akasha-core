export enum ButtonValues {
  ALL = 'All',
  KEPT = 'Kept',
  DELISTED = 'Delisted',
  STATS = 'Stats',
}

export enum ModerationItemTypes {
  ACCOUNT = 'account',
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  // @TODO: add support for tag type, when tag moderation is implemented
}

export type ModeratorStatus = 'active' | 'revoked' | 'resigned';

export interface IModeratorInfo {
  name: string;
  username: string;
  avatar: {
    url?: string;
    fallbackUrl?: string;
  };
  moderatorStartDate?: string;
  moderatorEndDate?: string;
  status: ModeratorStatus;
  social: {
    discord?: string;
    email?: string;
  };
}
