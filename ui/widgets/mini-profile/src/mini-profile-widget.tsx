import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import ProfileMiniCard from '@akashaorg/design-system-components/lib/components/ProfileMiniCard';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import {
  useCreateFollowMutation,
  useGetBeamByIdQuery,
  useGetFollowersListByDidQuery,
  useGetFollowingListByDidQuery,
  useGetMyProfileQuery,
  useGetProfileByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

const ProfileCardWidget: React.FC<RootExtensionProps> = props => {
  const { uiEvents, plugins } = props;
  const params: { beamId?: string } = useParams();
  const { t } = useTranslation('app-akasha-integration');

  const loggedProfileQuery = useGetMyProfileQuery(null, {
    select: data => data.viewer?.akashaProfile,
  });

  const beamAuthorId = useGetBeamByIdQuery(
    { id: params.beamId },
    {
      select: data => {
        if (data.node && 'author' in data.node) {
          return data.node.author.id;
        }
        return null;
      },
    },
  );

  const authorProfileDataReq = useGetProfileByDidQuery(
    { id: beamAuthorId.data },
    {
      enabled: beamAuthorId.isSuccess,
      select: data => {
        if (data.node && 'akashaProfile' in data.node) {
          return data.node;
        }
        return null;
      },
    },
  );

  const followersListReq = useGetFollowersListByDidQuery(
    {
      id: authorProfileDataReq.data?.akashaProfile?.did.id,
    },
    {
      select: data => {
        if (data.node && 'akashaProfile' in data.node) {
          return data.node.akashaProfile.followers.edges;
        }
      },
      enabled: authorProfileDataReq.isSuccess && !!authorProfileDataReq.data?.akashaProfile?.did,
    },
  );

  const followingListReq = useGetFollowingListByDidQuery(
    {
      id: authorProfileDataReq.data?.akashaProfile.did.id,
    },
    {
      select: data => {
        if (data.node && 'akashaFollowList' in data.node) {
          return data.node.akashaFollowList.edges;
        }
      },
      enabled: authorProfileDataReq.isSuccess && !!authorProfileDataReq.data.akashaProfile.did,
    },
  );

  const createFollowMutation = useCreateFollowMutation();
  const updateFollowMutation = useUpdateFollowMutation();

  const hasFollowed = React.useMemo(() => {
    return followersListReq.data.find(
      p => p.node.profile.did.id === loggedProfileQuery.data.did.id,
    );
  }, [followersListReq.data, loggedProfileQuery.data]);

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleFollow = React.useCallback(() => {
    if (!loggedProfileQuery.data?.did) {
      showLoginModal();
      return;
    }

    if (!hasFollowed) {
      // create follow mutation
    } else {
      // update follow mutation if isFollowing is false
    }
  }, [followersListReq.data, loggedProfileQuery.data]);

  const handleUnfollow = () => {
    if (!hasFollowed) {
      console.log('something is wrong, you cannot unfollow someone you never followed');
    } else {
      // update follow mutation if isFollowing is true
    }
  };

  const handleProfileClick = (pubKey: string) => {
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${authorProfileDataReq}`,
    });
  };

  return (
    <Stack customStyle="pb-2 max-h-[30rem]">
      <ProfileMiniCard
        handleClick={handleProfileClick}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isFollowing={!!hasFollowed && hasFollowed.node.isFollowing}
        loggedEthAddress={loggedProfileQuery.data?.did.id}
        profileData={authorProfileDataReq.data.akashaProfile}
        isViewer={authorProfileDataReq.data.isViewer}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        footerExt={<Extension name={`profile-mini-card-footer-extension`} uiEvents={uiEvents} />}
      />
    </Stack>
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
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
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
