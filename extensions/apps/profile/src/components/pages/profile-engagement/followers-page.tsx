import React, { useMemo } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Followers from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Followers';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import routes, { FOLLOWERS } from '../../../routes';
import { IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import {
  useGetFollowersListByDidQuery,
  useGetProfileByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  transformSource,
  hasOwn,
  useRootComponentProps,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { ENGAGEMENTS_PER_PAGE } from './types';
import { useTranslation } from 'react-i18next';

type FollowersPageProps = {
  profileDID: string;
};

const FollowersPage: React.FC<FollowersPageProps> = props => {
  const { profileDID } = props;
  const {
    data: { authenticatedDID, isAuthenticating: authenticating },
  } = useAkashaStore();
  const { getCorePlugins, navigateToModal } = useRootComponentProps();
  const isLoggedIn = !!authenticatedDID;
  const navigateTo = getCorePlugins().routing.navigateTo;
  const { t } = useTranslation('app-profile');

  const profileDataReq = useGetProfileByDidQuery({
    fetchPolicy:
      'cache-first' /* data is prefetched during route matching as a result we prefer reading cache first here  */,
    variables: { id: profileDID },
    skip: authenticatedDID === profileDID,
  });
  const { akashaProfile: profileData } =
    profileDataReq.data?.node && hasOwn(profileDataReq.data.node, 'akashaProfile')
      ? profileDataReq.data.node
      : { akashaProfile: null };

  const { data, error, fetchMore } = useGetFollowersListByDidQuery({
    fetchPolicy:
      'cache-only' /* data is prefetched during route matching as a result we read from cache here */,
    variables: {
      id: profileDID,
      first: ENGAGEMENTS_PER_PAGE,
    },
    skip: !isLoggedIn,
  });
  const followers = useMemo(
    () =>
      data?.node && hasOwn(data.node, 'akashaProfile')
        ? data.node?.akashaProfile?.followers?.edges
            ?.map(edge => edge?.node)
            .filter(node => node.did.akashaProfile) || []
        : [],
    [data?.node],
  );
  const pageInfo = useMemo(() => {
    return data?.node && hasOwn(data?.node, 'akashaProfile')
      ? data?.node.akashaProfile?.followers?.pageInfo
      : null;
  }, [data]);

  if (
    !data /* data is undefined until prefetching is complete therefore we display skeleton */ ||
    authenticating
  )
    return (
      <EngagementTab>
        <ProfileEngagementLoading />
      </EngagementTab>
    );

  const showLoginModal = (redirectTo?: { modal: IModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };

  const onProfileClick = (profileDID: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileDID}`,
    });
  };

  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileDID}${routes[FOLLOWERS]}`,
    });
  };

  const viewerIsOwner = authenticatedDID === profileDID;

  return (
    <EngagementTab profileDID={profileDID} navigateTo={navigateTo}>
      {error && (
        <Stack customStyle="mt-8">
          <InfoCard
            titleLabel={t('Oops! Something went wrong!')}
            bodyLabel={
              <>
                {t('Click')} {<Button label="here" variant="text" onClick={onError} />}{' '}
                {t('to try again!')}
              </>
            }
          />
        </Stack>
      )}
      {data && (
        <Followers
          authenticatedDID={authenticatedDID}
          followers={followers}
          profileAnchorLink={'/@akashaorg/app-profile'}
          emptyEntryTitleLabel={
            <>
              {viewerIsOwner
                ? t('Looks like there are no followers')
                : `${profileData?.name} ${t('has no followers yet')}`}
              !
            </>
          }
          emptyEntryBodyLabel={
            viewerIsOwner ? (
              <>
                {t("Interacting with people on AKASHA's")}
                <br /> {t('apps will help get followers')}!
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
          renderFollowElement={profileId => (
            <FollowProfileButton profileID={profileId} showLoginModal={showLoginModal} />
          )}
          onProfileClick={onProfileClick}
          transformSource={transformSource}
        />
      )}
    </EngagementTab>
  );
};

export default FollowersPage;
