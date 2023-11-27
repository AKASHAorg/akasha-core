import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useShowFeedback, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import withProfileHeader from './profile-header-hoc';
import InterestsPage from './pages/interests';
import EditProfilePage from './pages/edit-profile';
import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import ProfileInfoPage from './pages/profile-info';

import menuRoute, { EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { t } = useTranslation('app-profile');
  const { baseRouteName, navigateToModal, getRoutingPlugin } = useRootComponentProps();
  const [showUpdatedFeedback, setShowUpdatedFeedback] = useShowFeedback(false);
  const [showLinkCopiedFeedback, setLinkCopiedFeedback] = useShowFeedback(false);

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
    <Stack direction="column" spacing="gap-y-4" customStyle="mb-8">
      <Router basename={baseRouteName}>
        <Routes>
          <Route path="/">
            <Route
              path={':profileId'}
              element={withProfileHeader(<ProfileInfoPage showLoginModal={showLoginModal} />)(
                commonHeaderViewProps,
              )}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWERS]}`}
              element={withProfileHeader(<FollowersPage showLoginModal={showLoginModal} />)(
                commonHeaderViewProps,
              )}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={withProfileHeader(<FollowingPage showLoginModal={showLoginModal} />)(
                commonHeaderViewProps,
              )}
            />
            <Route
              path={`:profileId${menuRoute[INTERESTS]}`}
              element={withProfileHeader(<InterestsPage />)(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWERS]}`}
              element={<FollowersPage showLoginModal={showLoginModal} />}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={<FollowingPage showLoginModal={showLoginModal} />}
            />
            <Route path={`:profileId${menuRoute[INTERESTS]}`} element={<InterestsPage />} />
            <Route
              path={`:profileId${menuRoute[EDIT]}`}
              element={
                <EditProfilePage
                  handleProfileUpdatedFeedback={() => setShowUpdatedFeedback(true)}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
      {showUpdatedFeedback && (
        <Snackbar
          title={t('Profile updated successfully')}
          type="success"
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
          type="success"
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
