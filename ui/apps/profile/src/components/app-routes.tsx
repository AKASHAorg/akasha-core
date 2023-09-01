import React from 'react';
import menuRoute, { EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';
import EditProfilePage from './pages/edit-profile';
import ProfileInfoPage from './pages/profile-info';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import InterestsPage from './pages/interests/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useShowFeedback } from '@akashaorg/ui-awf-hooks';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-profile');

  const [showFeedback, setShowFeedback] = useShowFeedback(false);

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="mb-8">
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route path="/">
            <Route
              path={':profileId'}
              element={<ProfileInfoPage showLoginModal={showLoginModal} {...props} />}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWERS]}`}
              element={<FollowersPage {...props} />}
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={<FollowingPage {...props} />}
            />
            <Route
              path={`:profileId${menuRoute[INTERESTS]}`}
              element={<InterestsPage {...props} />}
            />
            <Route
              path={`:profileId${menuRoute[EDIT]}`}
              element={<EditProfilePage handleFeedback={handleFeedback} {...props} />}
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
