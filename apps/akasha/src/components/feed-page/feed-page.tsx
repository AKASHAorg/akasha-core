import * as React from 'react';
import DS from '@akashaproject/design-system';
import { constants, useBookmarks, useProfile, useErrors } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { uploadMediaToTextile } from '../../services/posting-service';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { redirectToPost } from '../../services/routing-service';
import EntryCardRenderer from './entry-card-renderer';
import routes, { POST } from '../../routes';
import { application as loginWidget } from '@akashaproject/ui-widget-login/lib/bootstrap';
import Parcel from 'single-spa-react/parcel';
import usePosts, { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';

const {
  Box,
  Helmet,
  VirtualList,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  useViewportSize,
  EditorModal,
  EditorPlaceholder,
} = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  singleSpa: any;
  logger: any;
  showLoginModal: () => void;
  ethAddress: string | null;
  currentUserCalled: boolean;
  pubKey: string | null;
  flagged: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onError: (err: IAkashaError) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    isMobile,
    flagged,
    reportModalOpen,
    setFlagged,
    setReportModalOpen,
    showLoginModal,
    ethAddress,
    currentUserCalled,
    pubKey,
    onError,
    sdkModules,
    logger,
    globalChannel,
  } = props;
  const [showEditor, setShowEditor] = React.useState(false);
  const [currentEmbedEntry, setCurrentEmbedEntry] = React.useState(undefined);

  const [loginProfile, loginProfileActions] = useProfile({
    profileService: sdkModules.profiles.profileService,
    ipfsService: sdkModules.commons.ipfsService,
  });

  React.useEffect(() => {
    if (pubKey) {
      loginProfileActions.getProfileData({ pubKey });
    }
  }, [pubKey]);

  React.useEffect(() => {
    if (currentUserCalled) {
      postsActions.resetPostIds();
      postsActions.getPosts({ limit: 5 });
    }
  }, [currentUserCalled]);

  const {
    size,
    dimensions: { width },
  } = useViewportSize();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarkState, bookmarkActions] = useBookmarks({
    pubKey,
    onError,
    dbService: sdkModules.db,
  });
  const [, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && currentUserCalled) {
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
  const handleEntryBookmark = (entryId: string) => {
    if (!pubKey) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };
  const handleEntryRepost = (_withComment: boolean, entryData: any) => {
    if (!pubKey) {
      showLoginModal();
    } else {
      setCurrentEmbedEntry(entryData);
      setShowEditor(true);
    }
  };
  const handleEntryShare = (
    service: 'twitter' | 'facebook' | 'reddit' | 'copy',
    entryId: string,
  ) => {
    const url = `${window.location.origin}${routes[POST]}/${entryId}`;
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  const handleEntryFlag = (entryId: string, user?: string | null) => () => {
    /* todo */
    if (!user) {
      // setting entryId to state first, if not logged in
      setFlagged(entryId);
      return showLoginModal();
    }
    setFlagged(entryId);
    setReportModalOpen(true);
  };

  const handleClickReplies = () => {
    /* todo */
  };

  const [tags, setTags] = React.useState([]);

  const handleGetTags = (query: string) => {
    const tagsService = sdkModules.posts.tags.searchTags({ tagName: query });
    tagsService.subscribe((resp: any) => {
      if (resp.data?.searchTags) {
        const filteredTags = resp.data.searchTags;
        setTags(filteredTags);
      }
    });
  };

  const [mentions, setMentions] = React.useState([]);
  const handleGetMentions = (query: string) => {
    const mentionsService = sdkModules.profiles.profileService.searchProfiles({
      name: query,
    });
    mentionsService.subscribe((resp: any) => {
      if (resp.data?.searchProfiles) {
        const filteredMentions = resp.data.searchProfiles;
        setMentions(filteredMentions);
      }
    });
  };

  const handleToggleEditor = () => {
    setShowEditor(!showEditor);
    setCurrentEmbedEntry(undefined);
  };

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleEntryPublish = async (data: PublishPostData) => {
    if (!ethAddress && !pubKey) {
      showLoginModal();
      return;
    }
    postsActions.optimisticPublishPost(data, loginProfile, currentEmbedEntry);
    setShowEditor(false);
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
        <title>AKASHA Feed | Ethereum.world</title>
      </Helmet>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {reportModalOpen && (
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
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              footerText2Label={t('and')}
              footerLink2Label={t('Terms of Service')}
              footerUrl2={'https://ethereum.world/terms-of-service'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={ethAddress ? ethAddress : ''}
              contentId={flagged}
              contentType="post"
              baseUrl={constants.BASE_FLAG_URL}
              size={size}
              width={width}
              updateEntry={updateEntry}
              closeModal={() => {
                setReportModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <EditorModal
        slotId={props.layout.app.modalSlotId}
        avatar={loginProfile.avatar}
        showModal={showEditor}
        ethAddress={ethAddress as any}
        postLabel={t('Publish')}
        placeholderLabel={t('Write something')}
        discardPostLabel={t('Discard Post')}
        discardPostInfoLabel={t(
          "You have not posted yet. If you leave now you'll discard your post.",
        )}
        keepEditingLabel={t('Keep Editing')}
        onPublish={handleEntryPublish}
        handleNavigateBack={handleToggleEditor}
        getMentions={handleGetMentions}
        getTags={handleGetTags}
        tags={tags}
        mentions={mentions}
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
          ethAddress ? (
            <EditorPlaceholder
              ethAddress={ethAddress}
              onClick={handleToggleEditor}
              style={{ marginTop: 8 }}
              avatar={loginProfile.avatar}
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
            ethAddress={ethAddress}
            locale={locale}
            onBookmark={handleEntryBookmark}
            onNavigate={handleNavigateToPost}
            onRepliesClick={handleClickReplies}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            onShare={handleEntryShare}
            onAvatarClick={handleAvatarClick}
            onMentionClick={handleMentionClick}
            contentClickable={true}
            awaitingModerationLabel={t('You have reported this post. It is awaiting moderation.')}
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
          loggedEthAddress: ethAddress,
          pendingEntries: postsState.pendingPosts,
        })}
      />
    </Box>
  );
};

export default FeedPage;
