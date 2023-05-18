import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import {
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
  Profile,
} from '@akashaorg/typings/ui';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
  useGetTag,
  useInfinitePostsByTag,
} from '@akashaorg/ui-awf-hooks';

const { Box, TagProfileCard, Helmet, styled, Spinner } = DS;

interface ITagFeedPage {
  loggedProfileData?: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const TagInfoCard = styled(TagProfileCard)`
  margin-bottom: 0.5rem;
`;

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const { showLoginModal, loggedProfileData } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { tagName } = useParams<{ tagName: string }>();

  // @TODO fix hooks
  const getTagQuery = useGetTag(tagName);

  const reqPosts = useInfinitePostsByTag(tagName, 15);

  const tagSubscriptionsReq = useTagSubscriptions(loggedProfileData?.did?.id);
  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts]);

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      itemId,
      itemType: EntityTypes.POST,
    });
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loggedProfileData?.did?.id) {
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
            itemType={EntityTypes.POST}
            logger={props.logger}
            onLoadMore={handleLoadMore}
            pages={postPages}
            getShareUrl={(itemId: string) =>
              `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
            }
            requestStatus={reqPosts.status}
            loggedProfileData={loggedProfileData}
            navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
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
            i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
          />
        </>
      )}
    </Box>
  );
};

export default TagFeedPage;
