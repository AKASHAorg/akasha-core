import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FeedPage from './pages/feed-page/feed-page';
import MyFeedPage from './pages/my-feed-page/my-feed-page';
import ProfileFeedPage from './pages/profile-feed-page/profile-feed-page';
import BeamPage from './pages/entry-page/beam-page';
import ReflectionPage from './pages/entry-page/reflection-page';
import TagFeedPage from './pages/tag-feed-page/tag-feed-page';
import EditorPage from './pages/editor-page/editor-page';
import EntrySectionLoading from './pages/entry-page/entry-section-loading';
import routes, { FEED, MY_FEED, PROFILE_FEED, BEAM, REFLECT, TAGS, EDITOR } from '../routes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, navigateToModal } = useRootComponentProps();
  const _navigateToModal = React.useRef(navigateToModal);
  const authenticatedProfileReq = useGetLoginProfile();

  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const showLoginModal = React.useCallback((redirectTo?: { modal: ModalNavigationOptions }) => {
    _navigateToModal.current?.({ name: 'login', redirectTo });
  }, []);

  return (
    <Router basename={baseRouteName}>
      <Stack>
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
      </Stack>
    </Router>
  );
};

export default AppRoutes;
