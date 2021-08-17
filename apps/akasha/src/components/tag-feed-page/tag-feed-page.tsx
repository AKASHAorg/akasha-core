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

  const tagSubscriptionsReq = useTagSubscriptions(loginState.ready?.ethAddress);
  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage && loginState.currentUserCalled) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts, loginState.currentUserCalled]);

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
        url = `/social-app/post/${
          queryClient.getQueryData<{ postId: string }>([ENTRY_KEY, details.entryId]).postId
        }`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  // const handleRepostPublish = (entryData: any, embedEntry: any) => {
  //   postsActions.optimisticPublishPost(entryData, loggedProfileData, embedEntry, true);
  // };

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
  console.log(reqPosts, '<<< req posts');
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
        onLoadMore={handleLoadMore}
        pages={postPages}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        requestStatus={reqPosts.status}
        errors={errorState}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={showLoginModal}
        hasNextPage={reqPosts.hasNextPage}
        // totalItems={postsState.totalItems}
        profilePubKey={loginState.pubKey}
        loggedProfile={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        handleFlipCard={handleFlipCard}
        uiEvents={props.uiEvents}
        itemSpacing={8}
      />
    </Box>
  );
};

export default TagFeedPage;
