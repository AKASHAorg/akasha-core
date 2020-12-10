import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useFeedReducer, useEntryBookmark } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  mapEntry,
  uploadMediaToTextile,
  buildPublishObject,
  PROPERTY_SLATE_CONTENT,
} from '../../services/posting-service';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { combineLatest } from 'rxjs';
import { redirectToPost } from '../../services/routing-service';

const {
  Box,
  Helmet,
  VirtualList,
  ErrorLoader,
  EntryCardLoading,
  EntryCard,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  ErrorInfoCard,
  useViewportSize,
  EditorModal,
} = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  navigateToUrl: (path: string) => void;
  logger: any;
  showLoginModal: () => void;
  ethAddress: string | null;
  jwtToken: string | null;
  flagged: string;
  modalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onError: (err: Error) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    isMobile,
    flagged,
    modalOpen,
    setFlagged,
    setModalOpen,
    showLoginModal,
    ethAddress,
    jwtToken,
    onError,
    sdkModules,
    logger,
  } = props;
  const [feedState, feedStateActions] = useFeedReducer({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [currentEmbedEntry, setCurrentEmbedEntry] = React.useState(undefined);

  const { size } = useViewportSize();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarks, bookmarkActions] = useEntryBookmark({
    ethAddress,
    onError,
    sdkModules: sdkModules,
    logger: logger,
  });

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!isLoading) {
      setIsLoading(true);
      fetchEntries(req);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const entryCall = sdkModules.posts.entries.getEntry({ entryId: payload.itemId });
    const ipfsGatewayCall = sdkModules.commons.ipfsService.getSettings({});
    const getEntryCall = combineLatest([ipfsGatewayCall, entryCall]);
    getEntryCall.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      const entry = resp[1].data?.getPost;
      if (entry) {
        const mappedEntry = mapEntry(entry, ipfsGateway);
        feedStateActions.setFeedItemData(mappedEntry);
      }
    });
  };
  const fetchEntries = async (payload: { limit: number; offset?: string }) => {
    const getEntriesCall = sdkModules.posts.entries.getEntries({
      ...payload,
      offset: payload.offset || feedState.nextItemId,
    });
    const ipfsGatewayCall = sdkModules.commons.ipfsService.getSettings({});
    const call = combineLatest([ipfsGatewayCall, getEntriesCall]);
    call.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      const {
        data,
      }: { channelInfo: any; data: { posts: { nextIndex: string; results: any[] } } } = resp[1];
      const { nextIndex, results } = data.posts;
      const entryIds: { entryId: string }[] = [];
      results.forEach(entry => {
        // filter out entries without content in slate format
        // currently entries can display only content in slate format
        // this can be changed later
        if (entry.content.findIndex((elem: any) => elem.property === PROPERTY_SLATE_CONTENT) > -1) {
          entryIds.push({ entryId: entry._id });
          const mappedEntry = mapEntry(entry, ipfsGateway);
          feedStateActions.setFeedItemData(mappedEntry);
        }
      });
      feedStateActions.setFeedItems({ items: entryIds, nextItemId: nextIndex });
      if (nextIndex === null) {
        feedStateActions.hasMoreItems(false);
      }
      setIsLoading(false);
    });
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    setIsLoading(true);
    fetchEntries(req);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };
  const handleEntryBookmark = (entryId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    bookmarkActions.addBookmark(entryId);
  };
  const handleEntryRepost = (_withComment: boolean, entryData: any) => {
    if (!ethAddress) {
      showLoginModal();
    } else {
      setCurrentEmbedEntry(entryData);
      setShowEditor(true);
    }
  };
  const handleEntryShare = () => {
    /* todo */
  };
  const handleEntryFlag = (entryId: string, user?: string | null) => () => {
    /* todo */
    if (!user) {
      // setting entryId to state first, if not logged in
      setFlagged(entryId);
      return showLoginModal();
    }
    setFlagged(entryId);
    setModalOpen(true);
  };
  const handleLinkCopy = () => {
    /* todo */
  };
  const handleClickReplies = () => {
    /* todo */
  };
  const handleFollow = () => {
    /* todo */
  };
  const handleUnfollow = () => {
    /* todo */
  };
  const handleGetMentions = () => {
    /* todo */
  };
  const handleGetTags = () => {
    /* todo */
  };

  const handleToggleEditor = () => {
    setShowEditor(!showEditor);
    setCurrentEmbedEntry(undefined);
  };

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const handleNavigateToPost = redirectToPost(props.navigateToUrl);

  const handleEntryPublish = async (data: {
    metadata: {
      app: string;
      version: number;
      quote?: string;
      tags: string[];
      mentions: string[];
    };
    author: string;
    content: any;
    textContent: any;
  }) => {
    if (!ethAddress && !jwtToken) {
      showLoginModal();
      return;
    }

    try {
      const publishObj = buildPublishObject(data);
      const postEntryCall = sdkModules.posts.entries.postEntry(publishObj);
      postEntryCall.subscribe((postingResp: any) => {
        const publishedEntryId = postingResp.data.createPost;
        feedStateActions.setFeedItems({
          reverse: true,
          items: [{ entryId: publishedEntryId }],
        });
      });
    } catch (err) {
      logger.error('Error publishing entry %j', err);
    }
    setShowEditor(false);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>AKASHA Feed | Ethereum.world</title>
      </Helmet>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {modalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Post')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World Safe! 🙌')}
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
              size={size}
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <EditorModal
        slotId={props.layout.app.modalSlotId}
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
        uploadRequest={onUploadRequest}
        embedEntryData={currentEmbedEntry}
        style={{ width: '36rem' }}
      />
      <VirtualList
        items={feedState.feedItems}
        itemsData={feedState.feedItemData}
        visitorEthAddress={ethAddress}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        loadInitialFeed={onInitialLoad}
        hasMoreItems={feedState.hasMoreItems}
        bookmarkedItems={bookmarks}
        getItemCard={({ itemData, visitorEthAddress, isBookmarked }) => (
          <ErrorInfoCard errors={{}}>
            {(errorMessages: any, hasCriticalErrors: boolean) => (
              <>
                {errorMessages && (
                  <ErrorLoader
                    type="script-error"
                    title={t('There was an error loading the entry')}
                    details={t('We cannot show this entry right now')}
                    devDetails={errorMessages}
                  />
                )}
                {!hasCriticalErrors && (
                  <>
                    {(!itemData || !itemData.author?.ethAddress) && <EntryCardLoading />}
                    {itemData && itemData.author.ethAddress && (
                      <EntryCard
                        isBookmarked={isBookmarked}
                        entryData={itemData}
                        sharePostLabel={t('Share Post')}
                        shareTextLabel={t('Share this post with your friends')}
                        sharePostUrl={'https://ethereum.world'}
                        onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                          handleAvatarClick(ev, itemData.author.ethAddress)
                        }
                        onEntryBookmark={handleEntryBookmark}
                        repliesLabel={t('Replies')}
                        repostsLabel={t('Reposts')}
                        repostLabel={t('Repost')}
                        repostWithCommentLabel={t('Repost with comment')}
                        shareLabel={t('Share')}
                        copyLinkLabel={t('Copy Link')}
                        copyIPFSLinkLabel={t('Copy IPFS Link')}
                        flagAsLabel={t('Report Post')}
                        loggedProfileEthAddress={ethAddress as any}
                        locale={locale}
                        style={{ height: 'auto' }}
                        bookmarkLabel={t('Save')}
                        bookmarkedLabel={t('Saved')}
                        onRepost={handleEntryRepost}
                        onEntryShare={handleEntryShare}
                        onEntryFlag={handleEntryFlag(itemData.CID, visitorEthAddress)}
                        onLinkCopy={handleLinkCopy}
                        onClickReplies={handleClickReplies}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                        onContentClick={handleNavigateToPost}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </ErrorInfoCard>
        )}
        customEntities={getFeedCustomEntities({
          t,
          locale,
          isMobile,
          feedItems: feedState.feedItems,
          loggedEthAddress: ethAddress,
          onAvatarClick: handleAvatarClick,
          onContentClick: handleNavigateToPost,
          handleEditorPlaceholderClick: handleToggleEditor,
        })}
      />
    </Box>
  );
};

export default FeedPage;
