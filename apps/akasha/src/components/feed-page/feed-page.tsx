import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useFeedReducer, useEntryBookmark } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { fetchFeedItemData } from '../../services/feed-service';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { serializeToSlate, getMediaUrl, uploadMediaToIpfs } from '../../services/posting-service';
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
    sdkModules: props.sdkModules,
    logger: props.logger,
  });

  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const req: { results: number; offset?: string } = {
      results: payload.limit,
    };
    if (!isLoading) {
      setIsLoading(true);
      fetchEntries(req);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      feedStateActions.setFeedItemData(resp);
    }
  };
  const fetchEntries = async (payload: { results: number; offset?: string }) => {
    const profileService = props.sdkModules.profiles.profileService;
    const getPostsCall = profileService.getPosts({
      ...payload,
      offset: payload.offset || feedState.lastItemId,
    });
    const ipfsGatewayCall = props.sdkModules.commons.ipfsService.getSettings({});
    const call = combineLatest(ipfsGatewayCall, getPostsCall);
    call.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      const { data }: { channelInfo: any; data: { last: string; result: any[] } } = resp[1];
      const { last, result } = data;
      const entryIds: { entryId: string }[] = [];
      result.forEach(entry => {
        entryIds.push({ entryId: entry.post.id });
        const mappedEntry = {
          author: {
            CID: entry.author.CID,
            description: entry.author.about,
            avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
            coverImage: getMediaUrl(
              ipfsGateway,
              entry.author.backgroundImage?.hash,
              entry.author.backgroundImage?.data,
            ),
            ensName: entry.author.username,
            userName:
              entry.author?.data &&
              `${entry.author?.data?.firstName} ${entry.author?.data?.lastName}`,
            ethAddress: entry.author.address,
            postsNumber: entry.author.entries && Object.keys(entry.author.entries).length,
          },
          CID: entry.post.CID,
          content: serializeToSlate(entry.post, ipfsGateway),
          entryId: entry.post.id,
          ipfsLink: entry.id,
          permalink: 'null',
        };
        // console.table([mappedEntry, entry]);
        feedStateActions.setFeedItemData(mappedEntry);
      });
      feedStateActions.setFeedItems({ items: entryIds, lastItemId: last });
      setIsLoading(false);
    });
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const req: { results: number; offset?: string } = {
      results: payload.limit,
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

  const onUploadRequest = uploadMediaToIpfs(props.sdkModules.commons.ipfsService);

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
      const entryObj = {
        data: [
          {
            provider: 'AkashaApp',
            property: 'slateContent',
            value: btoa(JSON.stringify(data.content)),
          },
        ],
        post: {
          tags: data.metadata.tags,
        },
      };
      const call = sdkModules.posts.entries.postEntry(entryObj);
      call.subscribe((resp: any) => {
        feedStateActions.setFeedItems({
          reverse: true,
          items: [resp.data as any],
        });
      });
    } catch (err) {
      props.logger.error('Error publishing entry %j', err);
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
              contentType={t('post')}
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
        hasMoreItems={true}
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
                        onEntryFlag={handleEntryFlag(itemData.entryId, visitorEthAddress)}
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
