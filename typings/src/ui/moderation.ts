import { EntityTypes } from './ui-events';
import { Profile } from './profile';

export enum ButtonValues {
  ALL = 'All',
  KEPT = 'Kept',
  DELISTED = 'Delisted',
  STATS = 'Stats',
}

export const ModerationEntityTypesMap = {
  [EntityTypes.PROFILE]: 'account',
  [EntityTypes.BEAM]: 'beam',
  [EntityTypes.REFLECT]: 'reflect',

  // @TODO: add support for tag type, when tag moderation is implemented
  [EntityTypes.ARTICLE]: 'article',
  [EntityTypes.TAG]: 'tag',
} as const;

export type ModeratorStatus = 'active' | 'dismissed' | 'resigned';

export interface IModeratorInfo {
  moderatorEndDate?: Date;
  status: ModeratorStatus;
  moderatedItems: number;
  social: {
    [key: string]: string;
  };
}

export type Moderator = Profile &
  IModeratorInfo & {
    active: boolean;
    admin: boolean;
  };

export type ModeratorApplicantData = Profile & {
  applicationDate?: string;
  reports: Record<string, string>[];
  history: Record<string, string>[];
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

export interface IModerationLogItemsCount {
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
  contentType: EntityTypes;
  explanation: string;
  reason: string;
}

export interface IModerationLogItem {
  decisionID: string;
  contentID: string;
  contentType: EntityTypes;
  delisted: false;
  reasons: string[];
  explanation: string;
  moderator: Moderator;
  moderatedDate: Date;
  reports: number;
}

export interface IPendingItem {
  _id: string;
  _mod: Date;
  creationDate: Date;
  decisionID: string;
  contentID: string;
  contentType: EntityTypes;
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
  moderatorProfile: Moderator;
}

export type ModerationCategory = { label: string; value: string };
