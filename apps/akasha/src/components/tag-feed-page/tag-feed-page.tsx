import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useErrors } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ITag } from '@akashaproject/design-system/lib/components/TrendingWidgetCard';
import { ENTRY_KEY, useInfinitePostsByTag } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
} from '@akashaproject/ui-awf-hooks/lib/use-tag-subscribe.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { useQueryClient } from 'react-query';

const { Box, TagProfileCard, Helmet } = DS;

interface ITagFeedPage {
  loggedProfileData?: any;
  loginState: ILoginState;
  showLoginModal: () => void;
}

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const { showLoginModal, logger, loggedProfileData, loginState } = props;

  const sdk = getSDK();

  const { tagName } = useParams<{ tagName: string }>();

  const [tagData, setTagData] = React.useState<ITag | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (tagName) {
      const tagsService = sdk.api.tags.getTag(tagName);
      const sub = tagsService.subscribe(resp => {
        if (resp.data?.getTag) {
          setTagData(resp.data.getTag);
        }
      });
      return () => sub.unsubscribe();
    }
  }, [tagName]);

  const [errorState] = useErrors({ logger });

  const reqPosts = useInfinitePostsByTag(tagName, 15);
  const postsState = reqPosts.data;
  const ids = React.useMemo(() => {
    const list = [];
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page => page.results.forEach(postId => list.push(postId)));
    return list;
  }, [reqPosts.isSuccess, postsState?.pages]);

  const entriesData = React.useMemo(() => {
    const list = {};
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page =>
      page.results.forEach(
        postId => (list[postId] = queryClient.getQueryData([ENTRY_KEY, postId])),
      ),
    );
    return list;
  }, [reqPosts.isSuccess, postsState?.pages]);

  const tagSubscriptionsReq = useTagSubscriptions(loginState.ready?.ethAddress);
  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const handleLoadMore = () => {
    if (!reqPosts.isFetching && loginState.currentUserCalled) {
      reqPosts.fetchNextPage().then(d => console.log('fetched next page', d));
    }
  };

  const handleItemDataLoad = () => {
    /* */
  };

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        // postsActions.resetPostIds();
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        url = `/social-app/post/${entriesData[details.entryId].postId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleFlipCard = (_entry: any, _isQuote: boolean) => () => {
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    // postsActions.updatePostsState(modifiedEntry);
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <TagProfileCard
        tag={tagData}
        subscribedTags={tagSubscriptions}
        handleSubscribeTag={handleTagSubscribe}
        handleUnsubscribeTag={handleTagSubscribe}
      />
      <FeedWidget
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        itemIds={ids}
        itemsData={entriesData}
        errors={errorState}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={showLoginModal}
        hasMoreItems={!!reqPosts.hasNextPage}
        // totalItems={postsState.totalItems}
        profilePubKey={loginState.pubKey}
        loggedProfile={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        handleFlipCard={handleFlipCard}
        uiEvents={props.uiEvents}
      />
    </Box>
  );
};

export default TagFeedPage;
