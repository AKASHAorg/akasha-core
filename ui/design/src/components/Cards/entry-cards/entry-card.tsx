import * as React from 'react';
import { ILocale } from '../../../utils/time';
import { MainAreaCardBox } from '../common/basic-card-box';
import { EntryBox } from '../index';
import { IEntryData } from './entry-box';
import { ServiceNames } from './card-actions';

export interface IEntryCardProps {
  className?: string;
  entryData: IEntryData;
  onClickAvatar: React.MouseEventHandler<any>;
  repliesLabel: string;
  repostsLabel: string;
  shareLabel: string;
  editPostLabel: string;
  copyLinkLabel: string;
  locale: ILocale;
  loggedProfileAvatar?: string;
  loggedProfileEthAddress: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  onEntryBookmark?: (entryId: string) => void;
  isBookmarked: boolean | null;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  onRepost: (withComment: boolean, entryId?: string) => void;
  onEntryShare: (service: ServiceNames, entryId?: string) => void;
  onEntryFlag: (entryId?: string) => void;
  onLinkCopy: (link: string) => void;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    className,
    entryData,
    onClickAvatar,
    repliesLabel,
    repostsLabel,
    shareLabel,
    editPostLabel,
    copyLinkLabel,
    locale,
    loggedProfileAvatar,
    loggedProfileEthAddress,
    style,
    rootNodeRef,
    onEntryBookmark,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    onRepost,
    onEntryShare,
    onEntryFlag,
    onLinkCopy,
  } = props;

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      <EntryBox
        entryData={entryData}
        onClickAvatar={onClickAvatar}
        repostsLabel={repostsLabel}
        repliesLabel={repliesLabel}
        shareLabel={shareLabel}
        editPostLabel={editPostLabel}
        copyLinkLabel={copyLinkLabel}
        locale={locale}
        loggedProfileAvatar={loggedProfileAvatar}
        loggedProfileEthAddress={loggedProfileEthAddress}
        onEntryBookmark={onEntryBookmark}
        isBookmarked={isBookmarked}
        bookmarkLabel={bookmarkLabel}
        bookmarkedLabel={bookmarkedLabel}
        onRepost={onRepost}
        onEntryShare={onEntryShare}
        onEntryFlag={onEntryFlag}
        onLinkCopy={onLinkCopy}
      />
    </MainAreaCardBox>
  );
};

export default EntryCard;
