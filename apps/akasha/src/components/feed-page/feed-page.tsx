import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { redirectToPost } from '../../services/routing-service';
import EntryCardRenderer from './entry-card-renderer';
import routes, { POST } from '../../routes';
import { application as loginWidget } from '@akashaproject/ui-widget-login/lib';
import Parcel from 'single-spa-react/parcel';
import { constants, useBookmarks, useErrors, useMentions } from '@akashaproject/ui-awf-hooks';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import usePosts, { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

const {
  Box,
  Helmet,
  VirtualList,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  EditorModal,
  EditorPlaceholder,
} = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  singleSpa: any;
  logger: any;
  showLoginModal: () => void;
  loggedProfileData?: any;
  loginState: ILoginState;
  flagged: string;
  flaggedContentType: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setFlaggedContentType: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: () => void;
  closeReportModal: () => void;
  editorModalOpen: boolean;
  setEditorModalOpen: () => void;
  closeEditorModal: () => void;
  onError: (err: IAkashaError) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    isMobile,
    flagged,
    flaggedContentType,
    reportModalOpen,
    setFlagged,
    setFlaggedContentType,
    setReportModalOpen,
    closeReportModal,
    editorModalOpen,
    setEditorModalOpen,
    closeEditorModal,
    showLoginModal,
    loggedProfileData,
    loginState,
    onError,
    sdkModules,
    logger,
    globalChannel,
  } = props;

  const [currentEmbedEntry, setCurrentEmbedEntry] = React.useState(undefined);

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError,
    dbService: sdkModules.db,
  });
  const [errorState, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
    profileService: sdkModules.profiles.profileService,
    postsService: sdkModules.posts.tags,
  });

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(errorState);
    }
  }, [JSON.stringify(errorState)]);

  React.useEffect(() => {
    if (loginState.currentUserCalled) {
      postsActions.resetPostIds();
      if (loginState.ethAddress) {
        bookmarkActions.getBookmarks();
      }
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    if (
      !postsState.postIds.length &&
      !postsState.isFetchingPosts &&
      postsState.totalItems === null
    ) {
      postsActions.getPosts({ limit: 5 });
    }
  }, [postsState.postIds.length, postsState.isFetchingPosts]);

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && loginState.currentUserCalled) {
      postsActions.getPosts(req);
    }
  };

  const loadItemData = (payload: ILoadItemDataPayload) => {
    postsActions.getPost(payload.itemId);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorPubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorPubKey}`);
    ev.preventDefault();
  };
  const handleMentionClick = (profilePubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profilePubKey}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };
  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.pubKey) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };
  const handleEntryRepost = (_withComment: boolean, entryData: any) => {
    setCurrentEmbedEntry(entryData);
    setEditorModalOpen();
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    setFlagged(entryId);
    setFlaggedContentType(contentType);
    setReportModalOpen();
  };

  const handleToggleEditor = () => {
    setCurrentEmbedEntry(undefined);
    if (editorModalOpen) {
      closeEditorModal();
    } else {
      setEditorModalOpen();
    }
  };

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleEntryPublish = async (data: PublishPostData) => {
    if (!loginState.ethAddress && !loginState.pubKey) {
      showLoginModal();
      return;
    }
    postsActions.optimisticPublishPost(data, loggedProfileData, currentEmbedEntry);
    closeEditorModal();
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const updateEntry = (entryId: string) => {
    const modifiedEntry = { ...postsState.postsData[entryId], reported: true };
    postsActions.updatePostsState(modifiedEntry);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <ModalRenderer slotId={props.layout.modalSlotId}>
        {reportModalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t(`Report ${flaggedContentType}`)}
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
              contentType={flaggedContentType}
              baseUrl={constants.BASE_REPORT_URL}
              updateEntry={updateEntry}
              closeModal={closeReportModal}
              signData={sdkModules.auth.authService.signData}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <EditorModal
        slotId={props.layout.modalSlotId}
        avatar={loggedProfileData.avatar}
        showModal={editorModalOpen}
        ethAddress={loginState.ethAddress as any}
        postLabel={t('Publish')}
        placeholderLabel={t('Write something')}
        emojiPlaceholderLabel={t('Search')}
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
      <VirtualList
        items={postsState.postIds}
        itemsData={postsState.postsData}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        hasMoreItems={!!postsState.nextPostIndex}
        usePlaceholders={true}
        listHeader={
          loginState.ethAddress ? (
            <EditorPlaceholder
              ethAddress={loginState.ethAddress}
              onClick={handleToggleEditor}
              avatar={loggedProfileData.avatar}
            />
          ) : (
            <>
              <Parcel
                config={loginWidget.loadingFn}
                wrapWith="div"
                sdkModules={props.sdkModules}
                logger={props.logger}
                layout={props.layout}
                globalChannel={props.globalChannel}
                i18n={props.i18n}
                mountParcel={props.singleSpa.mountRootParcel}
              />
            </>
          )
        }
        itemCard={
          <EntryCardRenderer
            sdkModules={sdkModules}
            logger={logger}
            globalChannel={globalChannel}
            bookmarkState={bookmarkState}
            ethAddress={loginState.ethAddress}
            locale={locale}
            onBookmark={handleEntryBookmark}
            onNavigate={handleNavigateToPost}
            singleSpaNavigate={props.singleSpa.navigateToUrl}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            sharePostUrl={`${window.location.origin}${routes[POST]}/`}
            onAvatarClick={handleAvatarClick}
            onMentionClick={handleMentionClick}
            onTagClick={handleTagClick}
            contentClickable={true}
            awaitingModerationLabel={t(
              'You have reported this content. It is awaiting moderation.',
            )}
            moderatedContentLabel={t('This content has been moderated')}
            ctaLabel={t('See it anyway')}
            handleFlipCard={handleFlipCard}
          />
        }
        customEntities={getFeedCustomEntities({
          sdkModules,
          logger,
          globalChannel,
          isMobile,
          feedItems: postsState.postIds,
          loggedEthAddress: loginState.ethAddress,
          pendingEntries: postsState.pendingPosts,
        })}
      />
    </Box>
  );
};

export default FeedPage;
