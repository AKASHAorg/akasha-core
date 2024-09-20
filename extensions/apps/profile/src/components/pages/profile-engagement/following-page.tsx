import React, { useMemo } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import routes, { FOLLOWING } from '../../../routes';
import { IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import {
  useGetFollowingListByDidQuery,
  useGetProfileByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  transformSource,
  hasOwn,
  useRootComponentProps,
  useAkashaStore,
  useNsfwToggling,
} from '@akashaorg/ui-awf-hooks';
import { ENGAGEMENTS_PER_PAGE } from './types';
import { useTranslation } from 'react-i18next';

type FollowingPageProps = {
  profileDID: string;
};

const FollowingPage: React.FC<FollowingPageProps> = props => {
  const { profileDID } = props;
  const {
    data: { authenticatedDID, isAuthenticating: authenticating },
  } = useAkashaStore();
  const { getCorePlugins, navigateToModal } = useRootComponentProps();
  const isLoggedIn = !!authenticatedDID;
  const navigateTo = getCorePlugins().routing.navigateTo;
  const { t } = useTranslation('app-profile');
  const { showNsfw } = useNsfwToggling();

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

  const { data, error, fetchMore } = useGetFollowingListByDidQuery({
    fetchPolicy:
      'cache-only' /* data is prefetched during route matching as a result we read from cache here */,
    variables: {
      id: profileDID,
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
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileDID}${routes[FOLLOWING]}`,
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
        <Following
          authenticatedDID={authenticatedDID}
          showNsfw={showNsfw}
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

export default FollowingPage;
