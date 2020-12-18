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
import EntryCardRenderer from './entry-card-renderer';

const {
  Box,
  Helmet,
  VirtualList,
  ReportModal,
  ToastProvider,
  ModalRenderer,
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
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onError: (err: Error) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    isMobile,
    flagged,
    navigateToUrl,
    reportModalOpen,
    setFlagged,
    setReportModalOpen,
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
  const [pendingEntries, setPendingEntries] = React.useState<string[]>([]);

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

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    navigateToUrl(`/profile/${authorEth}`);
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
  const handleEntryShare = (service: 'twitter' | 'facebook' | 'reddit', _entryId: string) => {
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${window.location.href}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${window.location.href}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank');
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
  const handleFollow = () => {
    /* todo */
  };
  const handleUnfollow = () => {
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
    const mentionsService = sdkModules.profiles.profileService.searchProfiles({ name: query });
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
    const tempEntryId = `pending-${feedState.pendingEntries.length}`;
    setPendingEntries(prev => prev.concat(tempEntryId));
    try {
      const publishObj = buildPublishObject(data);
      const postEntryCall = sdkModules.posts.entries.postEntry(publishObj);
      postEntryCall.subscribe((postingResp: any) => {
        const publishedEntryId = postingResp.data.createPost;
        setPendingEntries(prev => prev.filter(e => e === tempEntryId));
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
        {reportModalOpen && (
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
                setReportModalOpen(false);
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
        tags={tags}
        mentions={mentions}
        uploadRequest={onUploadRequest}
        embedEntryData={currentEmbedEntry}
        style={{ width: '36rem' }}
      />
      <VirtualList
        items={feedState.feedItems}
        itemsData={feedState.feedItemData}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        hasMoreItems={feedState.hasMoreItems}
        itemCard={
          <EntryCardRenderer
            bookmarks={bookmarks}
            ethAddress={ethAddress}
            locale={locale}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onBookmark={handleEntryBookmark}
            onNavigate={handleNavigateToPost}
            onRepliesClick={handleClickReplies}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            onShare={handleEntryShare}
            onAvatarClick={handleAvatarClick}
          />
        }
        customEntities={getFeedCustomEntities({
          isMobile,
          feedItems: feedState.feedItems,
          loggedEthAddress: ethAddress,
          handleEditorPlaceholderClick: handleToggleEditor,
          pendingEntries: pendingEntries,
        })}
      />
    </Box>
  );
};

export default FeedPage;
