import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import ExtensionPoint from '@akashaorg/design-system-components/lib/utils/extension-point';
import ProfileMiniCard from '@akashaorg/design-system-components/lib/components/ProfileMiniCard';
import { RootExtensionProps, EventTypes } from '@akashaorg/typings/ui';
import {
  useGetEntryAuthor,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useGetLogin,
  withProviders,
} from '@akashaorg/ui-awf-hooks';

const ProfileCardWidget: React.FC<RootExtensionProps> = props => {
  const params: { postId?: string } = useParams();
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();

  const profileDataReq = useGetEntryAuthor(params.postId);
  const profileData = profileDataReq.data;

  const isFollowingReq = useIsFollowingMultiple(loginQuery.data?.pubKey, [profileData?.did.id]);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleFollow = () => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    if (profileData?.pubKey) {
      followReq.mutate(profileData?.pubKey);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.pubKey) {
      unfollowReq.mutate(profileData?.pubKey);
    }
  };

  const handleProfileClick = (pubKey: string) => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const isFollowing = React.useMemo(() => {
    return !!followedProfiles.includes(profileData?.pubKey);
  }, [followedProfiles, profileData?.pubKey]);

  if (!profileData?.ethAddress) {
    return null;
  }

  const handleExtPointMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        pubKey: profileData?.pubKey,
      },
    });
  };

  const handleExtPointUnmount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };

  return (
    <Box customStyle="pb-2 max-h-[30rem]">
      <ProfileMiniCard
        handleClick={handleProfileClick}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isFollowing={isFollowing}
        loggedEthAddress={loginQuery.data?.ethAddress}
        profileData={profileData}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        footerExt={
          <ExtensionPoint
            name={`profile-mini-card-footer-extension`}
            onMount={handleExtPointMount}
            onUnmount={handleExtPointUnmount}
          />
        }
      />
    </Box>
  );
};

// Router is required for the useRouteMatch hook to extract the postId from the url
const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <Routes>
      <Route
        path="@akashaorg/app-akasha-integration/post/:postId"
        element={
          <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
            <ProfileCardWidget {...props} />
          </I18nextProvider>
        }
      />
    </Routes>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader type="script-error" title="Error in profile card widget" details={err.message} />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
