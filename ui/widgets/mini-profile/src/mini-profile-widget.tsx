import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ProfileMiniCard from '@akashaorg/design-system-components/lib/components/ProfileMiniCard';
import MiniProfileWidgetLoader from '@akashaorg/design-system-components/lib/components/Loaders/mini-profile-widget-loader';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/lib/ui';
import {
  getFollowList,
  hasOwn,
  transformSource,
  useAkashaStore,
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
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

type ProfileCardWidgetProps = {
  beamId?: string;
  reflectionId?: string;
};
const ProfileCardWidget: React.FC<ProfileCardWidgetProps> = props => {
  const { beamId, reflectionId } = props;
  const { t } = useTranslation('ui-widget-mini-profile');
  const { plugins, logger } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { data: beam, loading: beamLoading } = useGetBeamByIdQuery({
    variables: { id: beamId },
    skip: !beamId,
  });
  const { data: reflection, loading: reflectionLoading } = useGetReflectionByIdQuery({
    variables: { id: reflectionId },
    skip: !reflectionId,
  });
  const isLoggedIn = !!authenticatedDID;
  // set data based on beam or reflect page
  const data = beamId ? beam : reflection;
  const dataLoading = beamId ? beamLoading : reflectionLoading;
  const authorId = data?.node && hasOwn(data.node, 'author') ? data?.node?.author.id : '';
  const { data: authorProfileInfo, loading: authorProfileLoading } = useGetProfileByDidQuery({
    variables: { id: authorId },
    skip: !authorId,
  });

  const authorProfileData =
    authorProfileInfo?.node && hasOwn(authorProfileInfo.node, 'isViewer')
      ? authorProfileInfo.node?.akashaProfile
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
          <>
            {(authorProfileLoading || dataLoading) && <MiniProfileWidgetLoader />}
            {authorProfileData && (
              <ProfileMiniCard
                profileData={authorProfileData}
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
                    name={`follow_${authorProfileData?.id}`}
                    extensionData={{
                      profileID: authorProfileData?.id,
                      isFollowing: followList?.get(authorProfileData?.id)?.isFollowing,
                      followId: followList?.get(authorProfileData?.id)?.id,
                      isLoggedIn,
                    }}
                  />
                }
              />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

const Wrapped = () => {
  const { getTranslationPlugin } = useRootComponentProps();
  const rootRoute = createRootRoute({
    component: Outlet,
  });
  //@TODO get base route name from a hook rather instead of hardcoding it
  const antennaAppBaseRouteName = '@akashaorg/app-akasha-integration';
  const beamRoutes = (
    [
      `${antennaAppBaseRouteName}/beam/$beamId`,
      `${antennaAppBaseRouteName}/beam/$beamId/$`,
    ] as const
  ).map((path, index) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => {
        const { beamId } = beamRoutes[index].useParams();
        return (
          <I18nextProvider i18n={getTranslationPlugin().i18n}>
            <ProfileCardWidget beamId={beamId} />
          </I18nextProvider>
        );
      },
    }),
  );
  const reflectionRoutes = (
    [
      `${antennaAppBaseRouteName}/reflection/$reflectionId`,
      `${antennaAppBaseRouteName}/reflection/$reflectionId/$`,
    ] as const
  ).map((path, index) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => {
        const { reflectionId } = reflectionRoutes[index].useParams();
        return (
          <I18nextProvider i18n={getTranslationPlugin().i18n}>
            <ProfileCardWidget reflectionId={reflectionId} />
          </I18nextProvider>
        );
      },
    }),
  );
  const routeTree = rootRoute.addChildren([...beamRoutes, ...reflectionRoutes]);
  return <RouterProvider router={createRouter({ routeTree })} />;
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
