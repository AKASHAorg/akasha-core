import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import {
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
  Profile,
  IContentClickDetails,
} from '@akashaorg/typings/ui';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
  useGetTag,
  useInfinitePostsByTag,
} from '@akashaorg/ui-awf-hooks';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import TagProfileCard from '@akashaorg/design-system-components/lib/components/TagProfileCard';

interface ITagFeedPage {
  loggedProfileData?: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const {
    uiEvents,
    layoutConfig,
    plugins,
    logger,
    navigateToModal,
    showLoginModal,
    loggedProfileData,
  } = props;
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
      itemType: EntityTypes.BEAM,
    });
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loggedProfileData?.did?.id) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleRebeam = (withComment: boolean, beamId: string) => {};
  const handleBeamNavigate = (details: IContentClickDetails, contentType: EntityTypes) => {};

  return (
    <Box customStyle="w-full">
      <Helmet.Helmet>
        <title>Akasha World</title>
      </Helmet.Helmet>
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
          <Box customStyle="mb-2">
            <TagProfileCard
              tag={getTagQuery.data}
              subscribedTags={tagSubscriptions}
              handleSubscribeTag={handleTagSubscribe}
              handleUnsubscribeTag={handleTagSubscribe}
            />
          </Box>

          <FeedWidget
            modalSlotId={layoutConfig.modalSlotId}
            itemType={EntityTypes.BEAM}
            logger={logger}
            onLoadMore={handleLoadMore}
            pages={postPages}
            requestStatus={reqPosts.status}
            loggedProfileData={loggedProfileData}
            navigateTo={plugins['@akashaorg/app-routing']?.routing?.navigateTo}
            navigateToModal={navigateToModal}
            onLoginModalOpen={showLoginModal}
            hasNextPage={reqPosts.hasNextPage}
            contentClickable={true}
            onEntryRemove={handleEntryRemove}
            onEntryFlag={handleEntryFlag}
            uiEvents={uiEvents}
            itemSpacing={8}
            i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
            onRebeam={handleRebeam}
            onBeamNavigate={handleBeamNavigate}
          />
        </>
      )}
    </Box>
  );
};

export default TagFeedPage;
