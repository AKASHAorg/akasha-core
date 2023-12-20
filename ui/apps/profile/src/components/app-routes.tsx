import React, { Suspense, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import InterestsPage from './pages/interests';
import EditProfilePage from './pages/edit-profile';
import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import ProfileInfoPage from './pages/profile-info';
import ProfileBeamsPage from './pages/profile-beams';
import ProfileWithHeader from './profile-with-header';
import menuRoute, { BEAMS, EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModalNavigationOptions, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useShowFeedback, useRootComponentProps, useLoggedIn } from '@akashaorg/ui-awf-hooks';
import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';

const AppRoutes: React.FC<unknown> = () => {
  const { t } = useTranslation('app-profile');
  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  const { baseRouteName, navigateToModal, getRoutingPlugin } = useRootComponentProps();
  const [showUpdatedFeedback, setShowUpdatedFeedback] = useShowFeedback(false);
  const [showLinkCopiedFeedback, setLinkCopiedFeedback] = useShowFeedback(false);
  const [showNSFW, setShowNSFW] = useState(false);

  const navigateTo = getRoutingPlugin().navigateTo;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };

  const commonHeaderViewProps = {
    handleCopyFeedback: () => setLinkCopiedFeedback(true),
    navigateTo,
    navigateToModal,
    showLoginModal,
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="mb-4">
      <Router basename={baseRouteName}>
        <Routes>
          <Route path="/">
            <Route
              path={':profileId'}
              element={
                <ProfileWithHeader {...commonHeaderViewProps} showNSFW={showNSFW}>
                  <ProfileInfoPage
                    showNSFW={showNSFW}
                    setShowNSFW={setShowNSFW}
                    showLoginModal={showLoginModal}
                  />
                </ProfileWithHeader>
              }
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWERS]}`}
              element={
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <FollowersPage
                    isLoggedIn={isLoggedIn}
                    authenticatedDID={authenticatedDID}
                    showLoginModal={showLoginModal}
                  />
                </ProfileWithHeader>
              }
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <FollowingPage
                    isLoggedIn={isLoggedIn}
                    authenticatedDID={authenticatedDID}
                    showLoginModal={showLoginModal}
                  />
                </ProfileWithHeader>
              }
            />
            <Route
              path={`:profileId${menuRoute[INTERESTS]}`}
              element={
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <InterestsPage isLoggedIn={isLoggedIn} authenticatedDID={authenticatedDID} />
                </ProfileWithHeader>
              }
            />
            <Route
              path={`:profileId${menuRoute[EDIT]}`}
              element={
                <Suspense fallback={<ProfileLoading />}>
                  <EditProfilePage
                    isLoggedIn={isLoggedIn}
                    handleProfileUpdatedFeedback={() => setShowUpdatedFeedback(true)}
                  />
                </Suspense>
              }
            />
          </Route>
          <Route
            path={`:profileId${menuRoute[BEAMS]}`}
            element={
              <ProfileWithHeader {...commonHeaderViewProps}>
                <ProfileBeamsPage isLoggedIn={isLoggedIn} />
              </ProfileWithHeader>
            }
          />
        </Routes>
      </Router>
      {showUpdatedFeedback && (
        <Snackbar
          title={t('Profile updated successfully')}
          type={NotificationTypes.Success}
          icon={<CheckCircleIcon />}
          handleDismiss={() => {
            setShowUpdatedFeedback(false);
          }}
          customStyle="mb-4"
        />
      )}
      {showLinkCopiedFeedback && (
        <Snackbar
          title={`${t('Profile link copied')}!`}
          type={NotificationTypes.Success}
          icon={<CheckCircleIcon />}
          handleDismiss={() => {
            setLinkCopiedFeedback(false);
          }}
          customStyle="mb-4"
        />
      )}
    </Stack>
  );
};

export default AppRoutes;
