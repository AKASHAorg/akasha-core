import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useParams } from 'react-router-dom';
import { BeamEntry, TagFeed } from '@akashaorg/ui-lib-feed';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import TagProfileCard from '@akashaorg/design-system-components/lib/components/TagProfileCard';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';

export type TagFeedPageProps = {
  authenticatedProfile?: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const TagFeedPage: React.FC<TagFeedPageProps> = props => {
  const { authenticatedProfile, showLoginModal } = props;
  const { tagName } = useParams<{ tagName: string }>();

  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();

  // @TODO fix hooks
  const getTagQuery = undefined;

  // const tagSubscriptionsReq = undefined;
  const tagSubscriptions = undefined;

  const toggleTagSubscriptionReq = undefined;

  const handleTagSubscribe = (tagName: string) => {
    if (!authenticatedProfile?.did?.id) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
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
      <TagFeed
        queryKey={`app-akasha-integration_tag-antenna_${tagName}`}
        tag={tagName}
        estimatedHeight={150}
        itemSpacing={8}
        scrollerOptions={{ overscan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => <BeamEntry beamId={itemData.node.stream} />}
      />
    </Stack>
  );
};

export default TagFeedPage;
