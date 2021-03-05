import * as React from 'react';
import { IEntryData } from './entry-box';
export declare type ServiceNames = 'twitter' | 'reddit' | 'facebook' | 'copy';
export declare type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};
export interface CardActionProps {
  entryData: IEntryData;
  loggedProfileEthAddress?: string | null;
  sharePostLabel?: string;
  shareTextLabel?: string;
  sharePostUrl?: string;
  repostsLabel: string;
  repostLabel?: string;
  repostWithCommentLabel?: string;
  repliesLabel: string;
  isBookmarked?: boolean;
  copyLinkLabel?: string;
  bookmarkLabel?: string;
  bookmarkedLabel?: string;
  shareLabel?: string;
  handleEntryBookmark?: () => void;
  onRepost: () => void;
  handleRepliesClick: () => void;
  onShare: (service: ServiceNames, entryId: string) => void;
  disableActions?: boolean;
  onRepostWithComment?: () => void;
  disableReposting?: boolean;
  isModerated?: boolean;
}
declare const CardActions: React.FC<CardActionProps>;
export default CardActions;
