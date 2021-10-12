import * as React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18next, { setupI18next } from '../i18n';
import singleSpaReact from 'single-spa-react';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, useRouteMatch, Route } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { useGetEntryAuthor } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import routes, { POST } from '../routes';

const { Box, ProfileMiniCard } = DS;

const ProfileCardWidget: React.FC<RootComponentProps> = props => {
  const { params } = useRouteMatch<{ postId: string }>();
  const { t } = useTranslation();

  const loginQuery = useGetLogin({
    onError: (errorInfo: IAkashaError) => {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo.errorKey}`);
    },
  });

  const profileDataReq = useGetEntryAuthor(params.postId);
  const profileData = profileDataReq.data;

  const isFollowingReq = useIsFollowingMultiple(loginQuery.data?.ethAddress, [
    profileData?.ethAddress,
  ]);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const handleFollow = () => {
    if (profileData?.ethAddress) {
      followReq.mutate(profileData?.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.ethAddress) {
      unfollowReq.mutate(profileData?.ethAddress);
    }
  };

  const isFollowing = React.useMemo(() => {
    if (followedProfiles.includes(profileData?.ethAddress)) {
      return true;
    }
    return false;
  }, [followedProfiles, profileData?.ethAddress]);

  if (!profileData?.ethAddress) {
    return null;
  }

  return (
    <Box pad={{ bottom: 'small' }}>
      <ProfileMiniCard
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
      />
    </Box>
  );
};

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <Route path={`${routes[POST]}/:postId`}>
      <I18nextProvider i18n={i18next}>
        <ProfileCardWidget {...props} />
      </I18nextProvider>
    </Route>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <div>!</div>;
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-akasha-integration',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
