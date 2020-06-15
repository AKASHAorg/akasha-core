import { Box } from 'grommet';
import * as React from 'react';
import { formatDate, ILocale } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import CardActions, { ServiceNames } from './card-actions';
import CardHeaderMenuDropdown from './card-header-menu';

export interface IUser {
  name?: string;
  avatar?: string;
  ethAddress: string;
}

export interface IEntryData extends IUser {
  entryId?: string;
  content: string;
  time: string;
  comments?: Comment[];
  quotes: Quote[];
}

export interface Comment extends IUser {
  content: string;
  time: string;
  quotes: Quote[];
}

export interface Quote extends IUser {
  time: string;
}
export type ethAddress = string;
export interface IEntryBoxProps {
  entryData: IEntryData;
  onClickAvatar: React.MouseEventHandler<HTMLAnchorElement>;
  repliesLabel: string;
  repostsLabel: string;
  shareLabel: string;
  editPostLabel: string;
  copyLinkLabel: string;
  comment?: boolean;
  locale: ILocale;
  loggedProfileAvatar?: string;
  loggedProfileEthAddress: string;
  onEntryBookmark?: (entryId: string, isBookmarked: boolean | null) => void;
  isBookmarked: boolean | null;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  onEntryShare: (service: ServiceNames, entryId?: string) => void;
  onLinkCopy: (link: string) => void;
  onRepost: (withComment: boolean, entryId?: string) => void;
  onEntryFlag: (entryId?: string) => void;
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    onClickAvatar,
    repliesLabel,
    repostsLabel,
    shareLabel,
    editPostLabel,
    copyLinkLabel,
    locale,
    onEntryBookmark,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    onEntryShare,
    onLinkCopy,
    onRepost,
    onEntryFlag,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);

  const menuIconRef: React.Ref<any> = React.useRef();

  const handleLinkCopy = () => {
    onLinkCopy('LinkOfTheEntryHere!');
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const handleEntryBookmark = () => {
    if (onEntryBookmark && entryData.entryId) {
      onEntryBookmark(entryData.entryId, isBookmarked);
    }
  };

  const handleRepost = (withComment: boolean) => () => {
    onRepost(withComment, entryData.entryId);
  };

  const handleEntryShare = (service: ServiceNames) => {
    onEntryShare(service, entryData.entryId);
  };

  const handleEntryFlag = () => {
    onEntryFlag(entryData.entryId);
  };

  return (
    <div>
      <Box direction="row" justify="between" margin="medium" align="center">
        <ProfileAvatarButton
          label={entryData.name}
          info={formatDate(entryData.time, locale)}
          avatarImage={entryData.avatar}
          onClick={onClickAvatar}
          ethAddress={entryData.ethAddress}
        />
        <div ref={menuIconRef}>
          <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} />
        </div>
      </Box>
      {menuIconRef.current && menuDropOpen && (
        <CardHeaderMenuDropdown
          target={menuIconRef.current}
          onMenuClose={closeMenuDrop}
          onLinkCopy={handleLinkCopy}
          onFlag={handleEntryFlag}
          editPostLabel={editPostLabel}
          copyLinkLabel={copyLinkLabel}
        />
      )}
      <Box pad="medium">{entryData.content}</Box>
      <CardActions
        repliesLabel={repliesLabel}
        repostsLabel={repostsLabel}
        handleEntryBookmark={handleEntryBookmark}
        isBookmarked={isBookmarked}
        bookmarkLabel={bookmarkLabel}
        bookmarkedLabel={bookmarkedLabel}
        shareLabel={shareLabel}
        onRepost={handleRepost(false)}
        onRepostWithComment={handleRepost(true)}
        onShare={handleEntryShare}
        onLinkCopy={handleLinkCopy}
      />
    </div>
  );
};

export default EntryBox;
