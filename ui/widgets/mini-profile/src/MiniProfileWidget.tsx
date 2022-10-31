import * as React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import singleSpaReact from 'single-spa-react';
import { RootExtensionProps, EventTypes } from '@akashaorg/typings/ui';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import {
  useGetEntryAuthor,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useGetLogin,
  withProviders,
  ThemeWrapper,
} from '@akashaorg/ui-awf-hooks';

const { Box, ProfileMiniCard, ErrorLoader, ExtensionPoint } = DS;

const ProfileCardWidget: React.FC<RootExtensionProps> = props => {
  const params: { postId?: string } = useParams();
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();

  const profileDataReq = useGetEntryAuthor(params.postId);
  const profileData = profileDataReq.data;

  const isFollowingReq = useIsFollowingMultiple(loginQuery.data?.pubKey, [profileData?.pubKey]);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const handleFollow = () => {
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
    <Box pad={{ bottom: 'small' }} height={{ max: '30rem' }}>
      <ProfileMiniCard
        handleClick={handleProfileClick}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isFollowing={isFollowing}
        loggedEthAddress={loginQuery.data?.ethAddress}
        /* @Todo: fix my type ;/ */
        profileData={profileData as any}
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
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in profile card widget"
          details={err.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
