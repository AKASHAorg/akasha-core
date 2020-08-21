import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { genEntryData } from '../services/dummy-data';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { Box, EntryCard } = DS;

interface IPostPage {
  channels: any;
  globalChannel: any;
  logger: any;
}

const PostPage: React.FC<IPostPage> = _props => {
  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const itemData = genEntryData(postId);

  const isBookmarked = false;
  const handleAvatarClick = () => {
    // todo
  };
  const handleEntryBookmark = () => {
    // todo
  };
  const handleEntryRepost = () => {
    // todo
  };
  const handleEntryFlag = () => {
    // todo
  };
  const handleLinkCopy = () => {
    // todo
  };
  const handleClickReplies = () => {
    // todo
  };
  const handleFollow = () => {
    // todo
  };
  const handleUnfollow = () => {
    // todo
  };
  const handleEntryShare = () => {
    // todo
  };

  return (
    <Box>
      <EntryCard
        isBookmarked={isBookmarked}
        entryData={itemData}
        onClickAvatar={handleAvatarClick}
        onEntryBookmark={handleEntryBookmark}
        repliesLabel={t('Replies')}
        repostsLabel={t('Reposts')}
        repostLabel={t('Repost')}
        repostWithCommentLabel={t('Repost with comment')}
        shareLabel={t('Share')}
        copyLinkLabel={t('Copy Link')}
        copyIPFSLinkLabel={t('Copy IPFS Link')}
        flagAsLabel={t('Flag as inappropiate')}
        loggedProfileEthAddress={'0x00123123123123'}
        locale={locale}
        style={{ height: 'auto' }}
        bookmarkLabel={t('Save')}
        bookmarkedLabel={t('Saved')}
        onRepost={handleEntryRepost}
        onEntryShare={handleEntryShare}
        onEntryFlag={handleEntryFlag}
        onLinkCopy={handleLinkCopy}
        onClickReplies={handleClickReplies}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
      />
      <div>Reply Editor (Coming Soon)</div>
      <div>Replies List (Coming Soon)</div>
    </Box>
  );
};

export default PostPage;
