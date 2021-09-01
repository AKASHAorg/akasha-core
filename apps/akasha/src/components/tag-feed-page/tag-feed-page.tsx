import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import getSDK from '@akashaproject/awf-sdk';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/entry-feed';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ITag } from '@akashaproject/design-system/lib/components/TrendingWidgetCard';
import { ENTRY_KEY, useInfinitePostsByTag } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
  useGetTag,
} from '@akashaproject/ui-awf-hooks/lib/use-tag.new';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

const { Box, TagProfileCard, Helmet, styled, ErrorLoader } = DS;

interface ITagFeedPage {
  loggedProfileData?: IProfileData;
  loginState: ILoginState;
  showLoginModal: (redirectTo?: ModalNavigationOptions) => void;
}

const TagInfoCard = styled(TagProfileCard)`
  margin-bottom: 0.5rem;
`;

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const { showLoginModal, loggedProfileData, loginState } = props;
  const { t, i18n } = useTranslation();
  const { tagName } = useParams<{ tagName: string }>();
  const queryClient = useQueryClient();
  const getTagQuery = useGetTag(tagName);

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

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    if (!loginState.pubKey) {
      return showLoginModal({ name: 'report-modal', entryId, contentType });
    }
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
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
      {getTagQuery.status === 'loading' && <></>}
      {getTagQuery.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('Error loading tag data')}
          details={getTagQuery.error}
        />
      )}
      {getTagQuery.status === 'success' && (
        <TagInfoCard
          tag={getTagQuery.data}
          subscribedTags={tagSubscriptions}
          handleSubscribeTag={handleTagSubscribe}
          handleUnsubscribeTag={handleTagSubscribe}
        />
      )}
      <FeedWidget
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        onLoadMore={handleLoadMore}
        pages={postPages}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        requestStatus={reqPosts.status}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={showLoginModal}
        hasNextPage={reqPosts.hasNextPage}
        profilePubKey={loginState.pubKey}
        loggedProfile={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        uiEvents={props.uiEvents}
        itemSpacing={8}
        i18n={i18n}
      />
    </Box>
  );
};

export default TagFeedPage;
