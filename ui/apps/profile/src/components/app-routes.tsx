import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useShowFeedback, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

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

  const [showFeedback, setShowFeedback] = useShowFeedback(false);
  const navigateTo = getRoutingPlugin().navigateTo;

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({ name: 'login', redirectTo });
  };

  const commonHeaderViewProps = {
    handleFeedback,
    navigateTo,
    navigateToModal: navigateToModal,
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
              element={withProfileHeader(<FollowersPage />)(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={withProfileHeader(<FollowingPage />)(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[INTERESTS]}`}
              element={withProfileHeader(<InterestsPage />)(commonHeaderViewProps)}
            />
            <Route path={`:profileId${menuRoute[FOLLOWERS]}`} element={<FollowersPage />} />
            <Route path={`:profileId${menuRoute[FOLLOWING]}`} element={<FollowingPage />} />
            <Route path={`:profileId${menuRoute[INTERESTS]}`} element={<InterestsPage />} />
            <Route
              path={`:profileId${menuRoute[EDIT]}`}
              element={<EditProfilePage handleFeedback={handleFeedback} />}
            />
          </Route>
        </Routes>
      </Router>
      {showFeedback && (
        <Snackbar
          title={t('Profile updated successfully')}
          type="success"
          iconType="CheckCircleIcon"
          handleDismiss={() => {
            setShowFeedback(false);
          }}
          customStyle="mb-4"
        />
      )}
    </Stack>
  );
};

export default AppRoutes;
