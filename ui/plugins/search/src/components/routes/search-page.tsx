import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useParams } from 'react-router-dom';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import {
  constants,
  useBookmarks,
  useFollow,
  useSearch,
  useTagSubscribe,
  usePosts,
  useErrors,
  useMentions,
} from '@akashaproject/ui-awf-hooks';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { UseLoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import {
  ModalState,
  ModalStateActions,
  MODAL_NAMES,
} from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const {
  Box,
  BasicCardBox,
  ErrorLoader,
  Spinner,
  EntryCard,
  EntryCardHidden,
  EditorModal,
  ProfileSearchCard,
  TagSearchCard,
  SwitchCard,
  ReportModal,
  ToastProvider,
  ModalRenderer,
} = DS;

interface SearchPageProps {
  onError?: (err: Error) => void;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  rxjsOperators: any;
  singleSpa: any;
  loginState: UseLoginState;
  loggedProfileData: any;
  showLoginModal: () => void;
  modalState: ModalState;
  modalStateActions: ModalStateActions;
}

const SearchPage: React.FC<SearchPageProps & RootComponentProps> = props => {
  const {
    sdkModules,
    logger,
    singleSpa,
    globalChannel,
    rxjsOperators,
    loginState,
    loggedProfileData,
    modalState,
    modalStateActions,
    showLoginModal,
  } = props;

  const { searchKeyword } = useParams<{ searchKeyword: string }>();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [flagged, setFlagged] = React.useState('');

  const [, errorActions] = useErrors({ logger });

  const [, postsActions] = usePosts({
    user: loginState.ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError: (err: IAkashaError) => {
      logger.error('useBookmark error %j', err);
    },
    dbService: sdkModules.db,
  });

  const [searchState, searchActions] = useSearch({
    user: loginState.ethAddress,
    logger: logger,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    rxjsOperators,
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    rxjsOperators,
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
    profileService: sdkModules.profiles.profileService,
    postsService: sdkModules.posts.tags,
  });

  React.useEffect(() => {
    if (loginState.currentUserCalled) {
      searchActions.search(decodeURIComponent(searchKeyword));
    }
  }, [searchKeyword, loginState.currentUserCalled, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      bookmarkActions.getBookmarks();
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      searchState.profiles.slice(0, 4).forEach(async (profile: any) => {
        if (loginState.ethAddress && profile.ethAddress) {
          followActions.isFollowing(loginState.ethAddress, profile.ethAddress);
        }
      });
    }
  }, [searchState, loginState.ethAddress]);

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleTagUnsubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.follow(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.unfollow(ethAddress);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/social-app/post/${entryId}`);
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleEntryFlag = (entryId: string) => {
    setFlagged(entryId);

    modalStateActions.showAfterLogin(MODAL_NAMES.REPORT);
  };

  const hideReportModal = () => {
    modalStateActions.hide(MODAL_NAMES.REPORT);
  };

  // repost related
  const showEditorModal = () => {
    modalStateActions.showAfterLogin(MODAL_NAMES.EDITOR);
  };

  const hideEditorModal = () => {
    modalStateActions.hide(MODAL_NAMES.EDITOR);
  };

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const [currentEmbedEntry, setCurrentEmbedEntry] = React.useState(undefined);

  const handleRepost = (_withComment: boolean, entryData: any) => {
    setCurrentEmbedEntry(entryData);
    showEditorModal();
  };

  const handleToggleEditor = () => {
    setCurrentEmbedEntry(undefined);
    if (modalState.editor) {
      hideEditorModal();
    } else {
      showEditorModal();
    }
  };

  const handleEntryPublish = (entryData: any) => {
    if (!loginState.ethAddress || !loginState.pubKey) {
      showLoginModal();
      return;
    }

    postsActions.optimisticPublishPost(entryData, loggedProfileData, currentEmbedEntry, true);
    hideEditorModal();
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    // modify the entry
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    // update state
    searchActions.updateSearchState(modifiedEntry);
  };

  const updateEntry = (entryId: string) => {
    // find and modify the entry from state using the entryId
    const modifiedEntry = {
      ...searchState.entries.find((entry: any) => entry.entryId === entryId),
      reported: true,
    };
    // update state
    searchActions.updateSearchState(modifiedEntry);
  };

  const emptySearchState =
    searchState.profiles.length === 0 &&
    searchState.entries.length === 0 &&
    searchState.comments.length === 0 &&
    searchState.tags.length === 0;

  const [activeButton, setActiveButton] = React.useState<string>('All');
  const buttonValues = ['All', 'People', 'Topics', 'Posts', 'Replies'];
  const buttonLabels = [t('All'), t('People'), t('Topics'), t('Posts'), t('Replies')];

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  const onNavBack = () => {
    history.back();
  };

  const searchCount =
    searchState.profiles?.length +
    searchState.entries?.length +
    searchState.tags?.length +
    searchState.comments?.length;

  return (
    <Box fill="horizontal">
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {modalState.report && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Post')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              optionValues={[
                'Suspicious, deceptive, or spam',
                'Abusive or harmful to others',
                'Self-harm or suicide',
                'Illegal',
                'Nudity',
                'Violence',
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'/legal/code-of-conduct'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loginState.ethAddress ? loginState.ethAddress : ''}
              contentId={flagged}
              contentType="post"
              baseUrl={constants.BASE_FLAG_URL}
              updateEntry={updateEntry}
              closeModal={hideReportModal}
            />
          </ToastProvider>
        )}
        {modalState.editor && props.layout.app.modalSlotId && (
          <EditorModal
            slotId={props.layout.app.modalSlotId}
            avatar={loggedProfileData.avatar}
            showModal={modalState.editor}
            ethAddress={loginState.ethAddress}
            postLabel={t('Publish')}
            placeholderLabel={t('Write something')}
            discardPostLabel={t('Discard Post')}
            discardPostInfoLabel={t(
              "You have not posted yet. If you leave now you'll discard your post.",
            )}
            keepEditingLabel={t('Keep Editing')}
            onPublish={handleEntryPublish}
            handleNavigateBack={handleToggleEditor}
            getMentions={mentionsActions.getMentions}
            getTags={mentionsActions.getTags}
            tags={mentionsState.tags}
            mentions={mentionsState.mentions}
            uploadRequest={onUploadRequest}
            embedEntryData={currentEmbedEntry}
            style={{ width: '36rem' }}
          />
        )}
      </ModalRenderer>

      <SwitchCard
        count={searchCount}
        countLabel={t('Results')}
        activeButton={activeButton}
        onTabClick={onTabClick}
        onIconClick={onNavBack}
        hasIcon={true}
        hasMobileDesign={true}
        buttonLabels={buttonLabels}
        buttonValues={buttonValues}
        loggedEthAddress={loginState.ethAddress}
      />

      {searchState.isFetching && (
        <BasicCardBox>
          <Box pad="large">
            <Spinner />
          </Box>
        </BasicCardBox>
      )}
      {!searchState.isFetching && emptySearchState && (
        <BasicCardBox>
          <ErrorLoader
            type="no-login"
            title={`${t('No matching results found')} 😞`}
            details={t(
              'Make sure you spelled everything correctly or try searching for something else',
            )}
          />
        </BasicCardBox>
      )}

      {!searchState.isFetching && !emptySearchState && (
        <Box>
          {(activeButton === buttonValues[0] || activeButton === buttonValues[1]) &&
            searchState.profiles.slice(0, 4).map((profileData: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <ProfileSearchCard
                  handleFollow={() => handleFollowProfile(profileData.ethAddress)}
                  handleUnfollow={() => handleUnfollowProfile(profileData.ethAddress)}
                  isFollowing={followedProfiles.includes(profileData?.ethAddress)}
                  loggedEthAddress={loginState.ethAddress}
                  profileData={profileData}
                  followLabel={t('Follow')}
                  unfollowLabel={t('Unfollow')}
                  descriptionLabel={t('About me')}
                  followingLabel={t('Following')}
                  followersLabel={t('Followers')}
                  postsLabel={t('Posts')}
                  shareProfileLabel={t('Share')}
                  onClickProfile={() => handleProfileClick(profileData.pubKey)}
                />
              </Box>
            ))}

          {(activeButton === buttonValues[0] || activeButton === buttonValues[2]) &&
            searchState.tags.map((tag: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <TagSearchCard
                  tag={tag}
                  subscribedTags={tagSubscriptionState}
                  subscribeLabel={t('Subscribe')}
                  unsubscribeLabel={t('Unsubscribe')}
                  handleSubscribeTag={handleTagSubscribe}
                  handleUnsubscribeTag={handleTagUnsubscribe}
                />
              </Box>
            ))}
          {(activeButton === buttonValues[0] || activeButton === buttonValues[3]) &&
            searchState.entries.slice(0, 4).map((entryData: any) => (
              <Box key={entryData.entyId} pad={{ bottom: 'medium' }}>
                {entryData.delisted ? (
                  <EntryCardHidden
                    moderatedContentLabel={t('This content has been moderated')}
                    isDelisted={true}
                  />
                ) : entryData.reported ? (
                  <EntryCardHidden
                    awaitingModerationLabel={t(
                      'You have reported this post. It is awaiting moderation.',
                    )}
                    ctaLabel={t('See it anyway')}
                    handleFlipCard={handleFlipCard && handleFlipCard(entryData, false)}
                  />
                ) : (
                  <EntryCard
                    isBookmarked={
                      bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryData.entryId) >= 0
                    }
                    entryData={entryData}
                    sharePostLabel={t('Share Post')}
                    shareTextLabel={t('Share this post with your friends')}
                    sharePostUrl={`${window.location.origin}/social-app/post/`}
                    onClickAvatar={() => handleProfileClick(entryData.author.pubKey)}
                    onEntryBookmark={handleEntryBookmark}
                    repliesLabel={t('Replies')}
                    repostsLabel={t('Reposts')}
                    repostLabel={t('Repost')}
                    repostWithCommentLabel={t('Repost with comment')}
                    shareLabel={t('Share')}
                    copyLinkLabel={t('Copy Link')}
                    flagAsLabel={t('Report Post')}
                    loggedProfileEthAddress={loginState.ethAddress}
                    locale={locale || 'en'}
                    style={{ height: 'auto' }}
                    bookmarkLabel={t('Save')}
                    bookmarkedLabel={t('Saved')}
                    onRepost={handleRepost}
                    onEntryFlag={handleEntryFlag}
                    handleFollowAuthor={() => handleFollowProfile(entryData.author.ethAddress)}
                    handleUnfollowAuthor={() => handleUnfollowProfile(entryData.author.ethAddress)}
                    isFollowingAuthor={followedProfiles.includes(entryData.author)}
                    onContentClick={() => handlePostClick(entryData.entryId)}
                    onMentionClick={handleProfileClick}
                    contentClickable={true}
                    handleFlipCard={handleFlipCard}
                  />
                )}
              </Box>
            ))}
          {(activeButton === buttonValues[0] || activeButton === buttonValues[4]) &&
            searchState.comments.slice(0, 4).map((commentData: any, index: number) => (
              <Box key={index} pad={{ bottom: 'medium' }}>
                <EntryCard
                  isBookmarked={
                    bookmarkState.bookmarks.findIndex(bm => bm.entryId === commentData.entryId) >= 0
                  }
                  entryData={commentData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={'https://ethereum.world'}
                  onClickAvatar={() => handleProfileClick(commentData.author.pubKey)}
                  onEntryBookmark={handleEntryBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={loginState.ethAddress}
                  locale={locale || 'en'}
                  style={{ height: 'auto' }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  onRepost={() => null}
                  onEntryFlag={handleEntryFlag}
                  handleFollowAuthor={() => handleFollowProfile(commentData.author.ethAddress)}
                  handleUnfollowAuthor={() => handleUnfollowProfile(commentData.author.ethAddress)}
                  isFollowingAuthor={followedProfiles.includes(commentData.author)}
                  onContentClick={() => handlePostClick(commentData.postId)}
                  onMentionClick={handleProfileClick}
                  contentClickable={true}
                  handleFlipCard={handleFlipCard}
                />
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
