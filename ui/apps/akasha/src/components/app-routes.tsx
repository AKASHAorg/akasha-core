import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useGetLogin, useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import GlobalAntennaPage from './pages/global-antenna-page';
import MyAntennaPage from './pages/my-antenna-page';
import ProfileFeedPage from './pages/profile-feed-page/profile-feed-page';
import BeamPage from './pages/entry-page/beam-page';
import ReflectionPage from './pages/entry-page/reflection-page';
import TagFeedPage from './pages/tag-feed-page/tag-feed-page';
import EditorPage from './pages/editor-page/editor-page';
import EntrySectionLoading from './pages/entry-page/entry-section-loading';
import routes, {
  GLOBAL_ANTENNA,
  MY_ANTENNA,
  PROFILE_FEED,
  BEAM,
  REFLECT,
  TAGS,
  EDITOR,
} from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { logger, navigateToModal } = useRootComponentProps();
  const { t } = useTranslation('app-akasha-integration');
  const _navigateToModal = React.useRef(navigateToModal);
  const { data, loading: authenticating } = useGetLogin();
  const authenticatedProfileReq = useGetLoginProfile();
  const isLoggedIn = !!data?.id;
  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const showLoginModal = React.useCallback((redirectTo?: { modal: ModalNavigationOptions }) => {
    _navigateToModal.current?.({
      name: 'login',
      redirectTo,
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
    });
  }, []);

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in akasha app'),
    },
    logger,
  };

  const location = useLocation();
  const currentPath = React.useMemo(() => location.pathname, [location.pathname]);

  return (
    <Routes>
      <Route
        path={routes[GLOBAL_ANTENNA]}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <GlobalAntennaPage
              isLoggedIn={isLoggedIn}
              authenticatedProfile={authenticatedProfile}
              showLoginModal={showLoginModal}
            />
          </ErrorBoundary>
        }
      />
      <Route
        path={routes[MY_ANTENNA]}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <MyAntennaPage
              authenticatedProfile={authenticatedProfile}
              showLoginModal={showLoginModal}
            />
          </ErrorBoundary>
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
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <React.Suspense fallback={<EntrySectionLoading />}>
              <BeamPage />
            </React.Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path={`${routes[TAGS]}/:tagName`}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <TagFeedPage showLoginModal={showLoginModal} />
          </ErrorBoundary>
        }
      />
      <Route
        path={`${routes[PROFILE_FEED]}/:did`}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
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
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <React.Suspense fallback={<EntrySectionLoading />}>
              <ReflectionPage />
            </React.Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path={`${routes[REFLECT]}/:reflectionId${routes[REFLECT]}`}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <React.Suspense fallback={<EntrySectionLoading />}>
              <ReflectionPage />
            </React.Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path={routes[EDITOR]}
        element={
          <ErrorBoundary {...errorBoundaryProps} key={currentPath}>
            <EditorPage authenticatedProfile={authenticatedProfile} />
          </ErrorBoundary>
        }
      />
      <Route path="/" element={<Navigate to={routes[GLOBAL_ANTENNA]} replace />} />
    </Routes>
  );
};

export default AppRoutes;
