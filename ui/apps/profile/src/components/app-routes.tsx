import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModalNavigationOptions, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useShowFeedback, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import InterestsPage from './pages/interests';
import EditProfilePage from './pages/edit-profile';
import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import ProfileInfoPage from './pages/profile-info';
import ProfileBeamsPage from './pages/profile-beams';
import ProfileWithHeader from './profile-with-header';
import menuRoute, { BEAMS, EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { t } = useTranslation('app-profile');
  const { baseRouteName, logger, navigateToModal, getRoutingPlugin } = useRootComponentProps();
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

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in profile app'),
    },
    logger,
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="mb-4">
      <Router basename={baseRouteName}>
        <Routes>
          {/* <Route path="/"> */}
          <Route
            path={':profileId'}
            element={
              <ErrorBoundary {...props}>
                <ProfileWithHeader {...commonHeaderViewProps} showNSFW={showNSFW}>
                  <ProfileInfoPage
                    showNSFW={showNSFW}
                    setShowNSFW={setShowNSFW}
                    showLoginModal={showLoginModal}
                  />
                </ProfileWithHeader>
              </ErrorBoundary>
            }
          />
          <Route
            path={`:profileId${menuRoute[FOLLOWERS]}`}
            element={
              <ErrorBoundary {...props}>
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <FollowersPage showLoginModal={showLoginModal} />
                </ProfileWithHeader>
              </ErrorBoundary>
            }
          />
          <Route
            path={`:profileId${menuRoute[FOLLOWING]}`}
            element={
              <ErrorBoundary {...props}>
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <FollowingPage showLoginModal={showLoginModal} />
                </ProfileWithHeader>
              </ErrorBoundary>
            }
          />
          <Route
            path={`:profileId${menuRoute[INTERESTS]}`}
            element={
              <ErrorBoundary {...props}>
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <InterestsPage />
                </ProfileWithHeader>
              </ErrorBoundary>
            }
          />
          <Route
            path={`:profileId${menuRoute[EDIT]}`}
            element={
              <ErrorBoundary {...props}>
                <Suspense fallback={<ProfileLoading />}>
                  <EditProfilePage
                    handleProfileUpdatedFeedback={() => setShowUpdatedFeedback(true)}
                  />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path={`:profileId${menuRoute[BEAMS]}`}
            element={
              <ErrorBoundary {...props}>
                <ProfileWithHeader {...commonHeaderViewProps}>
                  <ProfileBeamsPage />
                </ProfileWithHeader>
              </ErrorBoundary>
            }
          />
          {/* </Route> */}
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
