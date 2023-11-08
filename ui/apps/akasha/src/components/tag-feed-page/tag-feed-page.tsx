import React from 'react';

import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { EntityTypes, ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import TagProfileCard from '@akashaorg/design-system-components/lib/components/TagProfileCard';
import { useEntryNavigation, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import { AkashaBeamEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type TagFeedPageProps = {
  loggedProfileData?: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const TagFeedPage: React.FC<TagFeedPageProps> = props => {
  const { loggedProfileData, showLoginModal } = props;

  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();

  // const { tagName } = useParams<{ tagName: string }>();

  // @TODO fix hooks
  const getTagQuery = undefined;

  // const reqPosts = undefined;

  // const tagSubscriptionsReq = undefined;
  const tagSubscriptions = undefined;

  const toggleTagSubscriptionReq = undefined;

  // const postPages = React.useMemo(() => {
  //   if (reqPosts.data) {
  //     return reqPosts.data.pages;
  //   }
  //   return [];
  // }, [reqPosts.data]);

  // const handleLoadMore = React.useCallback(() => {
  //   if (!reqPosts.isLoading && reqPosts.hasNextPage) {
  //     reqPosts.fetchNextPage();
  //   }
  // }, [reqPosts]);

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    navigateToModal({
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

  const handleRebeam = (withComment: boolean, beamId: string) => {
    if (!loggedProfileData?.did.id) {
      showLoginModal();
    } else {
      getRoutingPlugin().navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${beamId}`,
      });
    }
  };

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      {getTagQuery?.status === 'loading' && <Spinner />}
      {getTagQuery?.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('Error loading tag data')}
          details={getTagQuery?.error?.message}
        />
      )}
      {getTagQuery?.status === 'success' && (
        <Stack customStyle="mb-2">
          <TagProfileCard
            tag={getTagQuery?.data}
            subscribedTags={tagSubscriptions}
            handleSubscribeTag={handleTagSubscribe}
            handleUnsubscribeTag={handleTagSubscribe}
          />
        </Stack>
      )}
      <FeedWidget<AkashaBeamEdge>
        queryKey={'app-akasha-integration_tag-antenna'}
        estimatedHeight={150}
        itemSpacing={8}
        itemType={EntityTypes.BEAM}
        scrollerOptions={{ overscan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => (
          <BeamCard
            entryData={itemData.node}
            contentClickable={true}
            onContentClick={() =>
              getRoutingPlugin().navigateTo({
                appName: '@akashaorg/app-akasha-integration',
                getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
              })
            }
          />
        )}
      />
      {/*<FeedWidget*/}
      {/*  queryKey="akasha-tag-feed-query"*/}
      {/*  // @TODO add a new entry for tags*/}
      {/*  itemType={EntityTypes.BEAM}*/}
      {/*  loggedProfileData={loggedProfileData}*/}
      {/*  onLoginModalOpen={showLoginModal}*/}
      {/*  contentClickable={true}*/}
      {/*  onEntryRemove={handleEntryRemove}*/}
      {/*  onEntryFlag={handleEntryFlag}*/}
      {/*  itemSpacing={8}*/}
      {/*  onRebeam={handleRebeam}*/}
      {/*  onNavigate={useEntryNavigation(getRoutingPlugin().navigateTo)}*/}
      {/*  newItemsPublishedLabel={t('New Beams published recently')}*/}
      {/*/>*/}
    </Stack>
  );
};

export default TagFeedPage;
