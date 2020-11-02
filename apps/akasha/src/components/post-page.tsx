import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { genEntryData } from '../services/dummy-data';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToIpfs } from '../services/posting-service';
import { getLoggedProfileStore } from '../state/logged-profile-state';

const { Box, MainAreaCardBox, EntryBox, EditorBox } = DS;

interface IPostPage {
  channels: any;
  globalChannel: any;
  logger: any;
}

const PostPage: React.FC<IPostPage> = props => {
  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const ipfsService = props.channels.commons.ipfsService;

  const Login = getLoggedProfileStore();
  const loggedEthAddress = Login.useStoreState((state: any) => state.data.ethAddress);

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
  const handlePublish = () => {
    // todo
  };
  const handleGetMentions = () => {
    /* todo */
  };
  const handleGetTags = () => {
    /* todo */
  };

  const onUploadRequest = uploadMediaToIpfs(ipfsService);

  return (
    <MainAreaCardBox style={{ height: 'auto' }}>
      <Box
        margin={{ horizontal: 'medium' }}
        pad={{ bottom: 'small' }}
        border={{ side: 'bottom', size: '1px', color: 'border' }}
      >
        <EntryBox
          isBookmarked={isBookmarked}
          entryData={itemData}
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          sharePostUrl={'https://ethereum.world'}
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
        {loggedEthAddress && (
          <Box border={{ side: 'all', size: '1px', color: 'border' }} pad="xxsmall" round="xsmall">
            <EditorBox
              ethAddress={loggedEthAddress}
              postLabel={t('Publish')}
              placeholderLabel={t('Write something')}
              onPublish={handlePublish}
              getMentions={handleGetMentions}
              getTags={handleGetTags}
              uploadRequest={onUploadRequest}
            />
          </Box>
        )}
      </Box>
      {itemData.replies?.map((reply, index) => (
        <Box
          key={index}
          margin={{ horizontal: 'medium' }}
          border={{ side: 'bottom', size: '1px', color: 'border' }}
        >
          <EntryBox
            isBookmarked={isBookmarked}
            entryData={reply}
            sharePostLabel={t('Share Post')}
            shareTextLabel={t('Share this post with your friends')}
            sharePostUrl={'https://ethereum.world'}
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
        </Box>
      ))}
    </MainAreaCardBox>
  );
};

export default PostPage;
