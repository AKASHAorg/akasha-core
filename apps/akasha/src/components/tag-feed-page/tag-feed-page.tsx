import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemsPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { usePosts, useTagSubscribe, useErrors } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { useTranslation } from 'react-i18next';
import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ITag } from '@akashaproject/design-system/lib/components/TrendingWidgetCard';

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

  React.useEffect(() => {
    if (tagName) {
      const tagsService = sdk.api.tags.getTag(tagName);
      const sub = tagsService.subscribe(resp => {
        if (resp.data?.getTag) {
          const tag = {
            name: resp.data.getTag.name,
            totalPosts: resp.data.getTag.posts?.length,
          };
          setTagData(tag);
        }
      });
      return () => sub.unsubscribe();
    }
  }, [tagName]);

  const [errorState, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    // reset post ids and virtual list, if user logs in or tag changes
    postsActions.resetPostIds();
  }, [loginState.ethAddress, tagName]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    // if post ids array is reset, get tag posts
    if (
      postsState.postIds.length === 0 &&
      !postsState.isFetchingPosts &&
      postsState.totalItems === null
    ) {
      postsActions.getTagPosts({ name: tagName, limit: 5 });
    }
  }, [postsState.postIds, postsState.isFetchingPosts]);

  const { t } = useTranslation();

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && tagName) {
      postsActions.getTagPosts({ name: tagName, ...req });
    }
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    postsActions.getPost(itemId);
  };

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        postsActions.resetPostIds();
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        url = `/social-app/post/${postsState.postsData[details.entryId].postId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleRepostPublish = (entryData: any, embedEntry: any) => {
    postsActions.optimisticPublishPost(entryData, loggedProfileData, embedEntry, true);
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const handleTagSubscribe = (name: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(name);
  };
  const handleTagUnsubscribe = (name: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(name);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <TagProfileCard
        tag={tagData}
        subscribedTags={tagSubscriptionState}
        handleSubscribeTag={handleTagSubscribe}
        handleUnsubscribeTag={handleTagUnsubscribe}
      />
      <FeedWidget
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        layout={props.layoutConfig}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        onLoginModalOpen={showLoginModal}
        totalItems={postsState.totalItems}
        profilePubKey={loginState.pubKey}
        modalSlotId={props.layoutConfig.modalSlotId}
        loggedProfile={loggedProfileData}
        onRepostPublish={handleRepostPublish}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        handleFlipCard={handleFlipCard}
      />
    </Box>
  );
};

export default TagFeedPage;
