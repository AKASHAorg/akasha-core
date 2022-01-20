import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
  useGetTag,
  LoginState,
  useInfinitePostsByTag,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

const { Box, TagProfileCard, Helmet, styled, ErrorLoader, Spinner } = DS;

interface ITagFeedPage {
  loggedProfileData?: IProfileData;
  loginState: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const TagInfoCard = styled(TagProfileCard)`
  margin-bottom: 0.5rem;
`;

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const { showLoginModal, loggedProfileData, loginState } = props;
  const { t, i18n } = useTranslation();
  const { tagName } = useParams<{ tagName: string }>();
  const getTagQuery = useGetTag(tagName);

  const reqPosts = useInfinitePostsByTag(tagName, 15);

  const tagSubscriptionsReq = useTagSubscriptions(loginState?.isReady && loginState?.ethAddress);
  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage && loginState?.fromCache) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts, loginState?.fromCache]);

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryId,
      entryType: ItemTypes.ENTRY,
    });
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState?.ethAddress) {
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
      {getTagQuery.status === 'loading' && <Spinner />}
      {getTagQuery.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('Error loading tag data')}
          details={getTagQuery.error?.message}
        />
      )}
      {getTagQuery.status === 'success' && (
        <>
          <TagInfoCard
            tag={getTagQuery.data}
            subscribedTags={tagSubscriptions}
            handleSubscribeTag={handleTagSubscribe}
            handleUnsubscribeTag={handleTagSubscribe}
          />
          <FeedWidget
            modalSlotId={props.layoutConfig.modalSlotId}
            itemType={ItemTypes.ENTRY}
            logger={props.logger}
            onLoadMore={handleLoadMore}
            pages={postPages}
            getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
            requestStatus={reqPosts.status}
            loginState={loginState}
            loggedProfile={loggedProfileData}
            singleSpaNavigate={props.singleSpa.navigateToUrl}
            navigateToModal={props.navigateToModal}
            onLoginModalOpen={showLoginModal}
            hasNextPage={reqPosts.hasNextPage}
            contentClickable={true}
            onEntryRemove={handleEntryRemove}
            onEntryFlag={handleEntryFlag}
            removeEntryLabel={t('Delete Post')}
            removedByMeLabel={t('You deleted this post')}
            removedByAuthorLabel={t('This post was deleted by its author')}
            uiEvents={props.uiEvents}
            itemSpacing={8}
            i18n={i18n}
          />
        </>
      )}
    </Box>
  );
};

export default TagFeedPage;
