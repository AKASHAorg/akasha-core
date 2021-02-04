import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import {
  usePosts,
  useEntryBookmark,
  useProfile,
  useFollow,
  useErrors,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { mapEntry, uploadMediaToTextile } from '../../services/posting-service';
import { BASE_FLAG_URL } from '../../services/constants';
import { redirectToPost } from '../../services/routing-service';
import { combineLatest } from 'rxjs';
import PostRenderer from './post-renderer';
import { getPendingComments } from './post-page-pending-comments';
import routes, { POSTS } from '../../routes';
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
    if (ethAddress) {
      loginProfileActions.getProfileData({ ethAddress: ethAddress });
    }
  }, [ethAddress]);

  const [bookmarks, bookmarkActions] = useEntryBookmark({
    sdkModules,
    ethAddress: ethAddress,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo);
    },
    logger: logger,
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
    call.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      const entry = resp[1].data?.getPost;
      if (entry) {
        const mappedEntry = mapEntry(entry, ipfsGateway, logger);
        setEntryData(mappedEntry);
      }
    });
  }, [postId]);

  const bookmarked = false;

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
    if (bookmarks.has(entryId)) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.addBookmark(entryId);
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
    service: 'twitter' | 'facebook' | 'reddit',
    entryId: string,
    authorEthAddress: string,
  ) => {
    const url = `${window.location.origin}/${routes[POSTS]}/${authorEthAddress}/post/${entryId}`;
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
      default:
        break;
    }
    window.open(shareUrl, '_blank');
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

  const handleNavigateToPost = redirectToPost(navigateToUrl);

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );
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
              baseUrl={BASE_FLAG_URL}
              size={size}
              closeModal={() => {
                setReportModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      {entryData && (
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
                handleAvatarClick(ev, entryData.author.ethAddress)
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
              loggedProfileEthAddress={'0x00123123123123'}
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
            onMentionClick={handleMentionClick}
            // contentClickable={true}
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
