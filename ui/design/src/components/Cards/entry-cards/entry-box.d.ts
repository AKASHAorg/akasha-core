import * as React from 'react';
import { ILocale } from '../../../utils/time';
import { IProfileData } from '../profile-cards/profile-widget-card';
import { ISocialData } from './social-box';
export interface IEntryData {
  CID?: string;
  content: any;
  time?: string | number | Date;
  replies?: number;
  reposts?: number;
  ipfsLink: string;
  permalink: string;
  entryId: string;
  author: IProfileData;
  quotedByAuthors?: ISocialData;
  quotedBy?: string;
  quote?: IEntryData;
  delisted?: boolean;
  reported?: boolean;
}
export interface IContentClickDetails {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress: string;
    entryId: string;
  } | null;
}
export interface IEntryBoxProps {
  entryData: IEntryData;
  locale: ILocale;
  loggedProfileEthAddress?: string | null;
  sharePostLabel?: string;
  shareTextLabel?: string;
  sharePostUrl?: string;
  repliesLabel: string;
  repostsLabel: string;
  repostLabel?: string;
  repostWithCommentLabel?: string;
  shareLabel?: string;
  flagAsLabel?: string;
  copyLinkLabel?: string;
  comment?: boolean;
  bookmarkLabel?: string;
  bookmarkedLabel?: string;
  isBookmarked?: boolean;
  onEntryBookmark?: (entryId: string, isBookmarked?: boolean) => void;
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onRepost?: (withComment: boolean, entryData: IEntryData) => void;
  onEntryFlag?: (entryId?: string) => void;
  handleFollowAuthor?: (profileEthAddress: string) => void;
  handleUnfollowAuthor?: (profileEthAddress: string) => void;
  isFollowingAuthor?: boolean;
  onContentClick?: (details: IContentClickDetails) => void;
  contentClickable?: boolean;
  onMentionClick?: (ethAddress: string) => void;
  style?: React.CSSProperties;
  disableReposting?: boolean;
  disableActions?: boolean;
  hidePublishTime?: boolean;
  awaitingModerationLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: any, isQuote: boolean) => () => void;
  isModerated?: boolean;
  scrollHiddenContent?: boolean;
}
declare const EntryBox: React.FC<IEntryBoxProps>;
export { EntryBox };
