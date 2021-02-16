import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import {
  constants,
  usePosts,
  useBookmarks,
  useProfile,
  useFollow,
  useErrors,
  moderationRequest,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { mapEntry, uploadMediaToTextile } from '../../services/posting-service';
import { redirectToPost } from '../../services/routing-service';
import { combineLatest } from 'rxjs';
import PostRenderer from './post-renderer';
import { getPendingComments } from './post-page-pending-comments';
import routes, { POST } from '../../routes';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  useViewportSize,
  VirtualList,
  Helmet,
  CommentEditor,
  EditorPlaceholder,
  EntryCardHidden,
} = DS;

interface IPostPage {
  ethAddress: string | null;
  pubKey: string | null;
  flagged: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: () => void;
  navigateToUrl: (path: string) => void;
  isMobile: boolean;
  onError: (err: IAkashaError) => void;
}

const PostPage: React.FC<IPostPage & RootComponentProps> = props => {
  const {
    sdkModules,
    globalChannel,
    flagged,
    reportModalOpen,
    setFlagged,
    setReportModalOpen,
    showLoginModal,
    logger,
    navigateToUrl,
    ethAddress,
    isMobile,
  } = props;

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();
  const [, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [entryData, setEntryData] = React.useState<any>(null);

  const { size } = useViewportSize();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [loginProfile, loginProfileActions] = useProfile({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
  });

  React.useEffect(() => {
    if (props.pubKey) {
      loginProfileActions.getProfileData({ pubKey: props.pubKey });
    }
  }, [props.pubKey]);

  const [bookmarkState, bookmarkActions] = useBookmarks({
    dbService: sdkModules.db,
    pubKey: props.pubKey,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo);
    },
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    if (ethAddress && entryData?.author.ethAddress) {
      followActions.isFollowing(ethAddress, entryData.author.ethAddress);
    }
  }, [ethAddress, entryData?.author.ethAddress]);

  const handleFollow = () => {
    if (entryData?.author.ethAddress) {
      followActions.follow(entryData?.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (entryData.author.ethAddress) {
      followActions.unfollow(entryData?.author.ethAddress);
    }
  };

  const isFollowing = followedProfiles.includes(entryData?.author?.ethAddress);

  const handleLoadMore = async (payload: any) => {
    const req: { limit: number; offset?: string; postID: string } = {
      limit: payload.limit,
      postID: postId,
    };
    if (!postsState.isFetchingComments) {
      postsActions.getComments(req);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    postsActions.getComment(payload.itemId);
  };

  React.useEffect(() => {
    const entryCall = sdkModules.posts.entries.getEntry({ entryId: postId });
    const ipfsGatewayCall = sdkModules.commons.ipfsService.getSettings({});
    const call = combineLatest([ipfsGatewayCall, entryCall]);
    call.subscribe(async (resp: any) => {
      const ipfsGateway = resp[0].data;
      const entry = resp[1].data?.getPost;
      if (entry) {
        const mappedEntry = mapEntry(entry, ipfsGateway, logger);

        const status = await moderationRequest.checkStatus(
          false,
          { user: ethAddress },
          mappedEntry.entryId,
        );

        const qstatus =
          mappedEntry.quote &&
          (await moderationRequest.checkStatus(
            false,
            { user: ethAddress },
            mappedEntry.quote.entryId,
          ));

        if (status && status.constructor === Object) {
          const modifiedEntry = {
            ...mappedEntry,
            reported: status.reported,
            delisted: status.delisted,
            quote: mappedEntry.quote
              ? {
                  ...mappedEntry.quote,
                  reported:
                    qstatus && status.constructor === Object
                      ? qstatus.reported
                      : mappedEntry.quote.reported,
                  delisted:
                    qstatus && status.constructor === Object
                      ? qstatus.delisted
                      : mappedEntry.quote.reported,
                }
              : mappedEntry.quote,
          };

          setEntryData(modifiedEntry);
        } else {
          setEntryData(mappedEntry);
        }
      }
    });
    // this is used to initialise comments when navigating to other post ids
    if (postId) {
      handleLoadMore({ limit: 5, postID: postId });
    }
  }, [postId]);

  const bookmarked = React.useMemo(() => {
    if (
      !bookmarkState.isFetching &&
      bookmarkState.bookmarks.findIndex(bm => bm.entryId === postId) >= 0
    ) {
      return true;
    }
    return false;
  }, [bookmarkState]);

  const handleMentionClick = (profileEthAddress: string) => {
    navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleCommentBookmark = (commentId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === commentId) >= 0) {
      return bookmarkActions.removeBookmark(commentId);
    }
    return bookmarkActions.bookmarkComment(commentId);
  };

  const handleEntryRepost = () => {
    // todo
  };
  const handleEntryFlag = (entryId: string, user?: string | null) => () => {
    /* todo */
    if (!user) {
      setFlagged(entryId);
      return showLoginModal();
    }
    setFlagged(entryId);
    setReportModalOpen(true);
  };
  const handleClickReplies = () => {
    // todo
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
  const handlePublish = async (data: {
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
    if (!ethAddress) {
      showLoginModal();
      return;
    }
    postsActions.optimisticPublishComment(data, postId, loginProfile);
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

  const handleNavigateToPost = redirectToPost(navigateToUrl, postsActions.resetPostIds);

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    setEntryData(modifiedEntry);
  };

  const handleListFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  return (
    <MainAreaCardBox style={{ height: 'auto' }}>
      <Helmet>
        <title>AKASHA Post | Ethereum.world</title>
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
              baseUrl={constants.BASE_FLAG_URL}
              size={size}
              closeModal={() => {
                setReportModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      {entryData && !entryData.delisted && !entryData.reported && (
        <>
          <Box
            margin={{ horizontal: 'medium' }}
            pad={{ bottom: 'small' }}
            border={{ side: 'bottom', size: '1px', color: 'border' }}
          >
            <EntryBox
              isBookmarked={bookmarked}
              entryData={entryData}
              sharePostLabel={t('Share Post')}
              shareTextLabel={t('Share this post with your friends')}
              sharePostUrl={'https://ethereum.world'}
              onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                handleAvatarClick(ev, entryData.author.pubKey)
              }
              onEntryBookmark={handleEntryBookmark}
              repliesLabel={t('Replies')}
              repostsLabel={t('Reposts')}
              repostLabel={t('Repost')}
              repostWithCommentLabel={t('Repost with comment')}
              shareLabel={t('Share')}
              copyLinkLabel={t('Copy Link')}
              flagAsLabel={t('Report Post')}
              loggedProfileEthAddress={ethAddress}
              locale={locale}
              bookmarkLabel={t('Save')}
              bookmarkedLabel={t('Saved')}
              onRepost={() => {
                return;
              }}
              onEntryShare={handleEntryShare}
              onEntryFlag={handleEntryFlag(entryData.entryId, ethAddress)}
              onClickReplies={handleClickReplies}
              handleFollowAuthor={handleFollow}
              handleUnfollowAuthor={handleUnfollow}
              isFollowingAuthor={isFollowing}
              onContentClick={handleNavigateToPost}
              onMentionClick={handleMentionClick}
              awaitingModerationLabel={t('You have reported this post. It is awaiting moderation.')}
              moderatedContentLabel={t('This content has been moderated')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          </Box>
          {!ethAddress && (
            <Box margin="medium">
              <EditorPlaceholder onClick={showLoginModal} ethAddress={null} />
            </Box>
          )}
          {ethAddress && (
            <Box margin="medium">
              <CommentEditor
                avatar={loginProfile.avatar}
                ethAddress={ethAddress}
                postLabel={t('Reply')}
                placeholderLabel={t('Write something')}
                onPublish={handlePublish}
                getMentions={handleGetMentions}
                getTags={handleGetTags}
                tags={tags}
                mentions={mentions}
                uploadRequest={onUploadRequest}
              />
            </Box>
          )}
        </>
      )}
      {entryData && !entryData.delisted && entryData.reported && (
        <EntryCardHidden
          awaitingModerationLabel={t('You have reported this post. It is awaiting moderation.')}
          ctaLabel={t('See it anyway')}
          handleFlipCard={handleFlipCard(entryData, false)}
        />
      )}
      {entryData && entryData.delisted && (
        <EntryCardHidden
          moderatedContentLabel={t('This content has been moderated')}
          isDelisted={true}
        />
      )}
      <VirtualList
        items={postsState.commentIds}
        itemsData={postsState.postsData}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        hasMoreItems={!!postsState.nextCommentIndex}
        itemCard={
          <PostRenderer
            sdkModules={sdkModules}
            logger={logger}
            globalChannel={globalChannel}
            bookmarkState={bookmarkState}
            ethAddress={ethAddress}
            locale={locale}
            onBookmark={handleCommentBookmark}
            onNavigate={handleNavigateToPost}
            onRepliesClick={handleClickReplies}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            onShare={handleEntryShare}
            onAvatarClick={handleAvatarClick}
            onMentionClick={handleMentionClick}
            handleFlipCard={handleListFlipCard}
          />
        }
        customEntities={getPendingComments({
          logger,
          globalChannel,
          locale,
          isMobile,
          sdkModules,
          feedItems: postsState.postIds,
          loggedEthAddress: ethAddress,
          pendingComments: postsState.pendingComments,
        })}
      />
    </MainAreaCardBox>
  );
};

export default PostPage;
