import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLogin, useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
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
  const { data } = useGetLogin();
  const authenticatedProfileReq = useGetLoginProfile();

  const isLoggedIn = !!data?.id;
  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const showLoginModal = React.useCallback((redirectTo?: { modal: ModalNavigationOptions }) => {
    _navigateToModal.current?.({ name: 'login', redirectTo });
  }, []);

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in akasha app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Routes>
        <Route
          path={routes[FEED]}
          element={
            <ErrorBoundary {...props}>
              <FeedPage
                isLoggedIn={isLoggedIn}
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[MY_FEED]}
          element={
            <ErrorBoundary {...props}>
              <MyFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[BEAM]}/:beamId`}
          element={
            <ErrorBoundary {...props}>
              <React.Suspense fallback={<EntrySectionLoading />}>
                <BeamPage />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[BEAM]}/:beamId${routes[REFLECT]}`}
          element={
            <ErrorBoundary {...props}>
              <React.Suspense fallback={<EntrySectionLoading />}>
                <BeamPage />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[TAGS]}/:tagName`}
          element={
            <ErrorBoundary {...props}>
              <TagFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[PROFILE_FEED]}/:did`}
          element={
            <ErrorBoundary {...props}>
              <ProfileFeedPage
                authenticatedProfile={authenticatedProfile}
                showLoginModal={showLoginModal}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[REFLECT]}/:reflectionId`}
          element={
            <ErrorBoundary {...props}>
              <React.Suspense fallback={<EntrySectionLoading />}>
                <ReflectionPage />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[REFLECT]}/:reflectionId${routes[REFLECT]}`}
          element={
            <ErrorBoundary {...props}>
              <React.Suspense fallback={<EntrySectionLoading />}>
                <ReflectionPage />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[EDITOR]}
          element={
            <ErrorBoundary {...props}>
              <EditorPage authenticatedProfile={authenticatedProfile} />
            </ErrorBoundary>
          }
        />
        <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
