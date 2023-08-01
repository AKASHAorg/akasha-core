import React, { useState } from 'react';
import menuRoute, { EDIT, FOLLOWERS, FOLLOWING } from '../routes';
import EditProfilePage from './pages/edit-profile';
import ProfileInfoPage from './pages/profile-info-page';
import ProfileEngagementsPage from './pages/profile-engagement';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-profile');

  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedback = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
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
              element={
                <ProfileEngagementsPage
                  {...props}
                  showLoginModal={showLoginModal}
                  engagementType={'followers'}
                />
              }
            />
            <Route
              path={`:profileId${menuRoute[FOLLOWING]}`}
              element={
                <ProfileEngagementsPage
                  {...props}
                  showLoginModal={showLoginModal}
                  engagementType={'following'}
                />
              }
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
