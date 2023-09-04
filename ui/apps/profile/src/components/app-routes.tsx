import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useShowFeedback, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';

import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import InterestsPage from './pages/interests/index';
import withProfileHeader from './profile-header-hoc';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useShowFeedback } from '@akashaorg/ui-awf-hooks';

import menuRoute, { EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';

const AppRoutes = () => {
  const { t } = useTranslation('app-profile');
  const [showFeedback, setShowFeedback] = useShowFeedback(false);
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({ name: 'login', redirectTo });
  };

  const commonHeaderViewProps = {
    handleFeedback,
    navigateTo,
    navigateToModal: props.navigateToModal,
    showLoginModal,
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="mb-8">
      <Router basename={baseRouteName}>
        <Routes>
          <Route path="/">
            <Route
              path={':profileId'}
              element={withProfileHeader(
                <ProfileInfoPage showLoginModal={showLoginModal} {...props} />,
              )(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWERS]}`}
              element={withProfileHeader(<FollowersPage {...props} />)(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={withProfileHeader(<FollowingPage {...props} />)(commonHeaderViewProps)}
            />
            <Route
              path={`:profileId${menuRoute[INTERESTS]}`}
              element={withProfileHeader(<InterestsPage {...props} />)(commonHeaderViewProps)}
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
