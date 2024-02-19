import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/typings/lib/ui';
import {
  getFollowList,
  hasOwn,
  transformSource,
  useGetLogin,
  useProfileStats,
  useRootComponentProps,
  withProviders,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetBeamByIdQuery,
  useGetFollowDocumentsByDidQuery,
  useGetProfileByDidQuery,
  useGetReflectionByIdQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ProfileMiniCard from '@akashaorg/design-system-components/lib/components/ProfileMiniCard';

const ProfileCardWidget: React.FC<unknown> = () => {
  const { t } = useTranslation('ui-widget-mini-profile');
  const { plugins, logger } = useRootComponentProps();
  const { beamId, reflectionId } = useParams<{ beamId?: string; reflectionId?: string }>();
  const { data: loginData } = useGetLogin();
  const { data: beam } = useGetBeamByIdQuery({ variables: { id: beamId } });
  const { data: reflection } = useGetReflectionByIdQuery({ variables: { id: reflectionId } });

  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;

  // set data based on beam or reflect page
  const data = beamId ? beam : reflection;

  const authorId = data?.node && hasOwn(data.node, 'author') ? data?.node?.author.id : '';

  const { data: authorProfileData } = useGetProfileByDidQuery({
    variables: {
      id: authorId,
    },
    skip: data?.node && !hasOwn(data.node, 'author'),
  });

  const profileData =
    authorProfileData?.node && hasOwn(authorProfileData.node, 'akashaProfile')
      ? authorProfileData.node.akashaProfile
      : null;

  const { data: stats, loading: statsLoading } = useProfileStats(authorId);

  const { data: followDocuments } = useGetFollowDocumentsByDidQuery({
    variables: {
      id: authenticatedDID,
      following: [authorId],
      last: 1,
    },
    skip: !isLoggedIn,
  });

  const followList = isLoggedIn
    ? getFollowList(
        followDocuments?.node && hasOwn(followDocuments.node, 'akashaFollowList')
          ? followDocuments.node?.akashaFollowList?.edges?.map(edge => edge?.node)
          : null,
      )
    : null;

  const handleCardClick = () => {
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${authorId}`,
    });
  };

  const beams = stats?.totalBeams ?? 0;
  const followers = stats?.totalFollowers ?? 0;

  return (
    <ErrorBoundary
      errorObj={{
        type: 'script-error',
        title: t('Error in my-apps widget'),
      }}
      logger={logger}
    >
      <div>
        {(beamId || reflectionId) && (
          <ProfileMiniCard
            profileData={profileData}
            authenticatedDID={authenticatedDID}
            beamsLabel={beams === 1 ? t('Beam') : t('Beams')}
            followingLabel={t('Following')}
            followersLabel={followers === 1 ? t('Follower') : t('Followers')}
            statsLoading={statsLoading}
            stats={{ followers, beams }}
            transformSource={transformSource}
            handleClick={handleCardClick}
            footerExt={
              <Extension
                name={`follow_${profileData?.id}`}
                extensionData={{
                  profileID: profileData?.id,
                  isFollowing: followList?.get(profileData?.id)?.isFollowing,
                  followId: followList?.get(profileData?.id)?.id,
                  isLoggedIn,
                }}
              />
            }
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// Router is required for the useRouteMatch hook to extract the postId from the url
const Wrapped = () => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <Router>
      <Routes>
        {[
          '@akashaorg/app-akasha-integration/beam/:beamId/*',
          '@akashaorg/app-akasha-integration/reflect/:reflectionId/*',
        ].map(r => (
          <Route
            key={r}
            path={r}
            element={
              <I18nextProvider i18n={getTranslationPlugin().i18n}>
                <ProfileCardWidget />
              </I18nextProvider>
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in mini profile widget"
        details={err.message}
        customStyle="mb-4"
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
