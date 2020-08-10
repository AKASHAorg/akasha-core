import * as React from 'react';
import DS from '@akashaproject/design-system';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { useLoggedProfileState } from '../state/logged-profile-state';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { fetchFeedItemData, fetchFeedItems } from '../services/feed-service';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';

const { Helmet, VirtualList, ErrorInfoCard, ErrorLoader, EntryCard, EntryCardLoading } = DS;

export interface PostsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

interface IPostsListProps {
  channels: any;
  logger: any;
  globalChannel: any;
}

interface IPostsState {
  isLoading: boolean;
  postItems: string[];
  postItemData: {
    [key: string]: any;
  };
}

const postsStateReducer = (state: IPostsState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'POSTS_LOAD_SUCCESS':
      return { ...state, isLoading: false };
    case 'LOAD_POST_ITEMS':
      return { ...state, isLoading: true };
    case 'LOAD_POST_ITEMS_SUCCESS':
      return { ...state, postItems: state.postItems.concat(action.payload), isLoading: false };
    case 'LOAD_POST_ITEM_DATA_SUCCESS':
      return {
        ...state,
        postItemData: { ...state.postItemData, [action.payload.entryId]: action.payload },
      };
    default:
      throw new Error(`Could not find action with type: ${action.type}`);
  }
};

const PostsList: React.FC<IPostsListProps> = props => {
  const { userId } = useParams<{ userId: string }>();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [loggedProfile, loggedProfileActions] = useLoggedProfileState(
    props.channels,
    props.globalChannel,
    props.logger,
  );
  const [postsState, dispatch] = React.useReducer(postsStateReducer, {
    isLoading: true,
    postItems: [],
    postItemData: {},
  });

  const { path } = useRouteMatch();
  const isMyPosts = !userId && path.split('/')[path.split('/').length - 1] === 'my-posts';

  React.useEffect(() => {
    // resolve userId
    // load entries of userId
    if (isMyPosts && !userId) {
      loggedProfileActions.getEthAddress();
    }
  }, [isMyPosts, userId]);
  React.useEffect(() => {
    if (loggedProfile.data.ethAddress) {
      loggedProfileActions.getProfileData(loggedProfile.data.ethAddress);
    }
  }, [loggedProfile.data.ethAddress]);
  // console.log(loggedProfile, 'list state');
  const handleLoadMore = async (payload: ILoadItemsPayload) => {
    const resp = await fetchFeedItems(payload);
    if (resp) {
      dispatch({
        type: 'LOAD_POST_ITEMS_SUCCESS',
        payload: resp.items.map(i => i.entryId),
      });
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    const resp = await fetchFeedItemData({ entryId: payload.itemId });
    if (resp) {
      dispatch({
        type: 'LOAD_POST_ITEM_DATA_SUCCESS',
        payload: resp,
      });
    }
  };

  const onInitialLoad = async (payload: ILoadItemsPayload) => {
    const response = await fetchFeedItems({
      start: payload.start,
      limit: payload.limit,
      reverse: payload.reverse,
    });
    if (response.items.length) {
      dispatch({
        type: 'LOAD_POST_ITEMS_SUCCESS',
        payload: response.items.map(i => i.entryId),
      });
    }
  };
  const handleAvatarClick = () => {
    /* todo */
  };
  const handleEntryBookmark = () => {
    /* todo */
  };
  const handleEntryRepost = () => {
    /* todo */
  };
  const handleEntryShare = () => {
    /* todo */
  };
  const handleEntryFlag = () => {
    /* todo */
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
  return (
    <>
      <Helmet>
        <title>AKASHA Posts | Ethereum.world</title>
      </Helmet>
      {isMyPosts && (
        <VirtualList
          items={postsState.postItems}
          itemsData={postsState.postItemData}
          loadMore={handleLoadMore}
          loadItemData={loadItemData}
          loadInitialFeed={onInitialLoad}
          hasMoreItems={true}
          getItemCard={({ itemData, isBookmarked }) => (
            <ErrorInfoCard errors={{}}>
              {(errorMessages, hasCriticalErrors) => (
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
                          style={{ height: 'auto' }}
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
                      )}
                    </>
                  )}
                </>
              )}
            </ErrorInfoCard>
          )}
        />
      )}
      {!isMyPosts && <>{userId} Posts list</>}
    </>
  );
};

const PostsPage: React.FC<PostsPageProps> = props => {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact={true} path={`${path}/my-posts`}>
          <PostsList
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
          />
        </Route>
        <Route path={`${path}/:userId`}>
          <PostsList
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
          />
        </Route>
        <Redirect exact={true} from={path} to={`${path}/my-posts`} />
      </Switch>
    </>
  );
};

export default PostsPage;
