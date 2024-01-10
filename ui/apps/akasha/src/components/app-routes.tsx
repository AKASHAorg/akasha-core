import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import FeedPage from './pages/feed-page/feed-page';
import MyFeedPage from './pages/my-feed-page/my-feed-page';
import ProfileFeedPage from './pages/profile-feed-page/profile-feed-page';
import BeamPage from './pages/entry-page/beam-page';
import ReflectionPage from './pages/entry-page/reflection-page';
import TagFeedPage from './pages/tag-feed-page/tag-feed-page';
import EditorPage from './pages/editor-page/editor-page';
import EntrySectionLoading from './pages/entry-page/entry-section-loading';
import routes, { FEED, MY_FEED, PROFILE_FEED, BEAM, REFLECT, TAGS, EDITOR } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger, navigateToModal } = useRootComponentProps();
  const { t } = useTranslation('app-akasha-integration');
  const _navigateToModal = React.useRef(navigateToModal);
  const authenticatedProfileReq = useGetLoginProfile();

  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const showLoginModal = React.useCallback((redirectTo?: { modal: ModalNavigationOptions }) => {
    _navigateToModal.current?.({ name: 'login', redirectTo });
  }, []);

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in social app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Routes>
          <Route
            path={routes[FEED]}
            element={
              <FeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={routes[MY_FEED]}
            element={
              <MyFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[BEAM]}/:beamId`}
            element={
              <React.Suspense fallback={<EntrySectionLoading />}>
                <BeamPage />
              </React.Suspense>
            }
          />
          <Route
            path={`${routes[BEAM]}/:beamId${routes[REFLECT]}`}
            element={
              <React.Suspense fallback={<EntrySectionLoading />}>
                <BeamPage />
              </React.Suspense>
            }
          />
          <Route
            path={`${routes[TAGS]}/:tagName`}
            element={
              <TagFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[PROFILE_FEED]}/:did`}
            element={
              <ProfileFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[REFLECT]}/:reflectionId`}
            element={
              <React.Suspense fallback={<EntrySectionLoading />}>
                <ReflectionPage />
              </React.Suspense>
            }
          />
          <Route
            path={`${routes[REFLECT]}/:reflectionId${routes[REFLECT]}`}
            element={
              <React.Suspense fallback={<EntrySectionLoading />}>
                <ReflectionPage />
              </React.Suspense>
            }
          />
          <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
          <Route
            path={routes[EDITOR]}
            element={<EditorPage authenticatedProfile={authenticatedProfile} />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
