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
  userName: string;
  avatar: {
    url?: string;
    fallbackUrl?: string;
  };
  moderatorEndDate?: string;
  status: ModeratorStatus;
  social: {
    [key: string]: string;
  };
}

export interface Moderator extends IModeratorInfo {
  _id: string;
  _mod: Date;
  creationDate: Date;
  active: boolean;
  admin: boolean;
  coverImage: string;
  pubKey: string;
  ethAddress: string;
}

type Profile = {
  pubKey: string;
  ethAddress: string;
  name: string;
  userName: string;
  avatar: string;
};

export interface ModerationStatus {
  contentId: string;
  delisted: boolean;
  moderated: boolean;
  reason: string;
  reported: boolean;
}

export interface Reason {
  _id: string;
  _mod: Date;
  creationDate: Date;
  active: boolean;
  description: string;
  label: string;
}

export interface ICount {
  kept: number;
  pending: number;
  delisted: number;
}

export interface EntryReport {
  _id: string;
  _mod: Date;
  creationDate: Date;
  author: string;
  contentID: string;
  contentType: string;
  explanation: string;
  reason: string;
}

export interface ILogItem {
  decisionID: string;
  contentID: string;
  contentType: string;
  delisted: false;
  reasons: string[];
  explanation: string;
  moderator: Profile;
  moderatedDate: Date;
  reports: number;
}

export interface IPendingItem {
  _id: string;
  _mod: Date;
  creationDate: Date;
  decisionID: string;
  contentID: string;
  contentType: string;
  delisted: boolean;
  moderated: boolean;
  reasons: string[];
  explanation: string;
  reportedBy: string;
  reportedByProfile: Profile;
  reportedDate: Date;
  reports: number;
  count: number;
}

export interface IModeratedItem extends IPendingItem {
  moderator: string;
  moderatedDate?: Date;
  evaluationDate?: Date;
  moderatorProfile: Profile;
}
