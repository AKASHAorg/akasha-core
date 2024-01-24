import React, { useMemo } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import routes, { FOLLOWING } from '../../../routes';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import {
  useGetFollowDocumentsByDidQuery,
  useGetFollowingListByDidQuery,
  useGetProfileByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  transformSource,
  hasOwn,
  getFollowList,
  useRootComponentProps,
  useGetLogin,
} from '@akashaorg/ui-awf-hooks';
import { ENGAGEMENTS_PER_PAGE } from './types';
import { useTranslation } from 'react-i18next';

type FollowingPageProps = {
  profileId: string;
};

const FollowingPage: React.FC<FollowingPageProps> = props => {
  const { profileId } = props;
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;
  const navigateTo = getRoutingPlugin().navigateTo;
  const { t } = useTranslation('app-profile');

  const profileDataReq = useGetProfileByDidQuery({
    fetchPolicy:
      'cache-first' /* data is prefetched during route matching as a result we prefer reading cache first here  */,
    variables: { id: profileId },
    skip: authenticatedDID === profileId,
  });
  const { akashaProfile: profileData } =
    profileDataReq.data?.node && hasOwn(profileDataReq.data.node, 'akashaProfile')
      ? profileDataReq.data.node
      : { akashaProfile: null };

  const { data, error, fetchMore } = useGetFollowingListByDidQuery({
    fetchPolicy:
      'cache-only' /* data is prefetched during route matching as a result we read from cache here */,
    variables: {
      id: profileId,
      first: ENGAGEMENTS_PER_PAGE,
    },
    skip: !isLoggedIn,
  });

  const following = useMemo(
    () =>
      data?.node && hasOwn(data.node, 'akashaFollowList')
        ? data?.node?.akashaFollowList?.edges?.map(edge => edge?.node) || []
        : [],
    [data?.node],
  );
  const pageInfo = useMemo(() => {
    return data?.node && hasOwn(data?.node, 'akashaFollowList')
      ? data?.node.akashaFollowList?.pageInfo
      : null;
  }, [data]);
  const followProfileIds = useMemo(() => following.map(follow => follow.profile?.id), [following]);
  const { data: followDocuments } = useGetFollowDocumentsByDidQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: authenticatedDID,
      following: followProfileIds,
      last: followProfileIds.length,
    },
    skip: !isLoggedIn || !followProfileIds.length,
  });

  if (
    !data /* data is undefined until prefetching is complete therefore we display skeleton */ ||
    authenticating
  )
    return (
      <EngagementTab>
        <ProfileEngagementLoading />
      </EngagementTab>
    );

  const followList = getFollowList(
    followDocuments?.node && hasOwn(followDocuments.node, 'akashaFollowList')
      ? followDocuments.node?.akashaFollowList?.edges.map(edge => edge?.node)
      : null,
  );

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };
  const onProfileClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
    });
  };

  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}${routes[FOLLOWING]}`,
    });
  };

  const viewerIsOwner = authenticatedDID === profileId;

  return (
    <EngagementTab profileId={profileId} navigateTo={navigateTo}>
      {error && (
        <Stack customStyle="mt-8">
          <EntryError onError={onError} />
        </Stack>
      )}
      {data && (
        <Following
          authenticatedDID={authenticatedDID}
          followList={followList}
          following={following}
          profileAnchorLink={'/@akashaorg/app-profile'}
          emptyEntryTitleLabel={
            <>
              {`${viewerIsOwner ? t('You are') : `${profileData?.name} ${t('is')}`} ${t(
                'not following anyone yet',
              )}`}
              !
            </>
          }
          emptyEntryBodyLabel={
            viewerIsOwner ? (
              <>
                {t('Following others will help you see interesting')}
                <br /> {t('contents written and shared by them')}!
              </>
            ) : null
          }
          onLoadMore={() => {
            if (pageInfo && pageInfo.hasNextPage) {
              return fetchMore({
                variables: {
                  after: pageInfo.endCursor,
                },
              });
            }
            return null;
          }}
          renderFollowElement={(profileId, followId, isFollowing) => (
            <FollowProfileButton
              profileID={profileId}
              isLoggedIn={isLoggedIn}
              followId={followId}
              isFollowing={isFollowing}
              showLoginModal={showLoginModal}
            />
          )}
          onProfileClick={onProfileClick}
          transformSource={transformSource}
        />
      )}
    </EngagementTab>
  );
};

export default FollowingPage;
