import * as React from 'react';
import {
  ILoadItemsPayload,
  ILoadItemDataPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch } from 'react-router-dom';
import { fetchFeedItems, fetchFeedItemData } from '../services/feed-service';
import { redirectToPost } from '../services/routing-service';
import DS from '@akashaproject/design-system';
import EntryCardRenderer from './feed-page/entry-card-renderer';

const {
  Helmet,
  VirtualList,
  EntryCardHidden /* ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard */,
} = DS;

interface IPostsListProps {
  channels: any;
  logger: any;
  globalChannel: any;
  ethAddress: string | null;
  pubKey: string | null;
  navigateToUrl: (path: string) => void;
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

  const [postsState, dispatch] = React.useReducer(postsStateReducer, {
    isLoading: true,
    postItems: [],
    postItemData: {},
  });

  const { path } = useRouteMatch();
  const isMyPosts = !userId && path.split('/')[path.split('/').length - 1] === 'my-posts';

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
  const handleEntryFlag = (_entryId: string, _author: string | null) => () => {
    /* todo */
  };
  const handleClickReplies = () => {
    /* todo */
  };
  const handleMentionClick = (profileEthAddress: string) => {
    props.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handleFlipCard = (entry: any) => () => {
    const entryMod = { ...entry, reported: false };
    dispatch({
      type: 'LOAD_POST_ITEM_DATA_SUCCESS',
      payload: entryMod,
    });
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
          hasMoreItems={true}
          itemCard={
            <EntryCardRenderer
              sdkModules={props.channels}
              globalChannel={props.globalChannel}
              logger={props.logger}
              ethAddress={props.ethAddress}
              locale={locale}
              onBookmark={handleEntryBookmark}
              onNavigate={redirectToPost(props.navigateToUrl)}
              onRepliesClick={handleClickReplies}
              onFlag={handleEntryFlag}
              onRepost={handleEntryRepost}
              onShare={handleEntryShare}
              onAvatarClick={handleAvatarClick}
              onMentionClick={handleMentionClick}
            />
          }
          itemCardAlt={(entry: any) => (
            <EntryCardHidden
              descriptionLabel={t(
                'This post was reported by a user for offensive and abusive content. It is awaiting moderation.',
              )}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard(entry)}
            />
          )}
        />
      )}
    </>
  );
};

export default PostsList;
