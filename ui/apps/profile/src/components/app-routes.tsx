import React from 'react';
import menuRoute, { EDIT, FOLLOWERS, FOLLOWING } from '../routes';
import ProfilePage from './pages/profile-page';
import ProfileEngagementsPage from './pages/profile-engagement';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/typings/ui';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-profile');

  return (
    <Router basename={props.baseRouteName}>
      <Routes>
        <Route path="/">
          <Route path={':profileId'} element={<ProfilePage {...props} />} />
          <Route
            path={`:profileId${menuRoute[FOLLOWERS]}`}
            element={<ProfileEngagementsPage {...props} engagementType={'followers'} />}
          />
          <Route
            path={`:profileId${menuRoute[FOLLOWING]}`}
            element={<ProfileEngagementsPage {...props} engagementType={'following'} />}
          />
          <Route
            path={`:profileId${menuRoute[EDIT]}`}
            element={<ProfilePage editMode={true} {...props} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};
export default AppRoutes;
