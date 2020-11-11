import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { genEntryData } from '../services/dummy-data';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToIpfs } from '../services/posting-service';
import { getLoggedProfileStore } from '../state/logged-profile-state';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  CommentEditor,
  useViewportSize,
  EditorPlaceholder,
} = DS;

interface IPostPage {
  channels: any;
  globalChannel: any;
  logger: any;
  slotId: string;
  showLoginModal: () => void;
}

const PostPage: React.FC<IPostPage> = props => {
  const { slotId, showLoginModal } = props;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [flagged, setFlagged] = React.useState('');

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();

  const { size } = useViewportSize();

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
  const handleEntryFlag = (entryId: string, user?: string | null) => () => {
    /* todo */
    if (!user) {
      return showLoginModal();
    }
    setFlagged(entryId);
    setModalOpen(true);
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
        <ModalRenderer slotId={slotId}>
          {modalOpen && (
            <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
              <ReportModal
                titleLabel={t('Report a Post')}
                successTitleLabel={t('Thank you for helping us keep Ethereum World Safe! 🙌')}
                successMessageLabel={t(
                  'We will investigate this post and take appropriate action.',
                )}
                optionsTitleLabel={t('Please select a reason')}
                option1Label={t('Suspicious, deceptive, or spam')}
                option2Label={t('Abusive or harmful to others')}
                option3Label={t('Self-harm or suicide')}
                option4Label={t('Illegal')}
                option5Label={t('Nudity')}
                option6Label={t('Violence')}
                descriptionLabel={t('Explanation')}
                descriptionPlaceholder={t('Please explain your reason(s)')}
                footerText1Label={t('If you are unsure, you can refer to our ')}
                footerLink1Label={t('Code of Conduct')}
                footerUrl1={
                  'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'
                }
                footerText2Label={t(' and ')}
                footerLink2Label={t('Terms of Service')}
                footerUrl2={'https://ethereum.world/terms-of-service'}
                cancelLabel={t('Cancel')}
                reportLabel={t('Report')}
                blockLabel={t('Block User')}
                closeLabel={t('Close')}
                user={loggedEthAddress ? loggedEthAddress : ''}
                contentId={flagged}
                size={size}
                closeModal={() => {
                  setModalOpen(false);
                }}
              />
            </ToastProvider>
          )}
        </ModalRenderer>
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
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={'0x00123123123123'}
          locale={locale}
          bookmarkLabel={t('Save')}
          bookmarkedLabel={t('Saved')}
          onRepost={handleEntryRepost}
          onEntryShare={handleEntryShare}
          onEntryFlag={handleEntryFlag(itemData.entryId, loggedEthAddress)}
          onLinkCopy={handleLinkCopy}
          onClickReplies={handleClickReplies}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      </Box>
      {!loggedEthAddress && (
        <Box margin="medium">
          <EditorPlaceholder onClick={props.showLoginModal} />{' '}
        </Box>
      )}
      {loggedEthAddress && (
        <Box margin="medium">
          <CommentEditor
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
            flagAsLabel={t('Report Post')}
            loggedProfileEthAddress={'0x00123123123123'}
            locale={locale}
            bookmarkLabel={t('Save')}
            bookmarkedLabel={t('Saved')}
            onRepost={handleEntryRepost}
            onEntryShare={handleEntryShare}
            onEntryFlag={handleEntryFlag(itemData.entryId, loggedEthAddress)}
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
