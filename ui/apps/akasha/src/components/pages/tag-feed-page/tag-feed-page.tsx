import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getSDK from '@akashaorg/awf-sdk';
import { hasOwn, useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  useGetIndexedStreamCountQuery,
  useGetInterestsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AkashaIndexedStreamStreamType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { BeamEntry, TagFeed } from '@akashaorg/ui-lib-feed';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import TagProfileCard from '@akashaorg/design-system-components/lib/components/TagProfileCard';
import TagFeedCard from '@akashaorg/design-system-components/lib/components/TagFeedCard';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';

export type TagFeedPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const TagFeedPage: React.FC<TagFeedPageProps> = props => {
  const { showLoginModal } = props;
  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;
  const authenticatedDID = data?.id;

  const { tagName } = useParams<{ tagName: string }>();

  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();

  const sdk = getSDK();
  const {
    data: beamCountData,
    loading: loadingCount,
    error: countQueryError,
  } = useGetIndexedStreamCountQuery({
    variables: {
      indexer: sdk.services.gql.indexingDID,
      filters: {
        and: [
          { where: { streamType: { equalTo: AkashaIndexedStreamStreamType.Beam } } },
          { where: { indexType: { equalTo: sdk.services.gql.labelTypes.TAG } } },
          { where: { indexValue: { equalTo: tagName } } },
          { where: { active: { equalTo: true } } },
        ],
      },
    },
  });

  const beamCount = useMemo(() => {
    return beamCountData && hasOwn(beamCountData.node, 'akashaIndexedStreamListCount')
      ? beamCountData.node.akashaIndexedStreamListCount
      : 0;
  }, [beamCountData]);

  // fetch user's interest subscription

  const { data: tagSubscriptionsData, refetch: refetchTagSubscriptions } =
    useGetInterestsByDidQuery({
      variables: { id: authenticatedDID },
      skip: !isLoggedIn,
    });

  const tagSubscriptions = useMemo(() => {
    if (!isLoggedIn) return null;
    return tagSubscriptionsData &&
      hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests') &&
      tagSubscriptionsData.node.akashaProfileInterests?.topics.length > 0
      ? tagSubscriptionsData.node.akashaProfileInterests?.topics.map(topic => topic.value)
      : [];
  }, [isLoggedIn, tagSubscriptionsData]);

  const tagSubscriptionsId = useMemo(() => {
    if (!isLoggedIn) return null;
    return tagSubscriptionsData && hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests')
      ? tagSubscriptionsData.node.akashaProfileInterests?.id
      : null;
  }, [isLoggedIn, tagSubscriptionsData]);

  const handleTagSubscribe = (tagName: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
  };

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      {loadingCount && <Spinner />}
      {countQueryError && (
        <ErrorLoader
          type="script-error"
          title={t('Error loading tag data')}
          details={countQueryError?.message}
        />
      )}
      {!loadingCount && (
        <Stack customStyle="mb-2">
          <TagProfileCard
            tag={{
              name: tagName,
              totalPosts: beamCount,
            }}
            subscribedTags={tagSubscriptions}
            isLoading={false}
            handleSubscribeTag={() => handleTagSubscribe(tagName)}
            handleUnsubscribeTag={() => handleTagSubscribe(tagName)}
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
