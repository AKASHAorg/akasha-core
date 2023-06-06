import React from 'react';
import menuRoute, { EDIT, FOLLOWERS, FOLLOWING } from '../routes';
import NoProfileFound from './pages/no-profile-found';
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
            element={<ProfileEngagementsPage {...props} selectedStat={'followers'} />}
          />
          <Route
            path={`:profileId${menuRoute[FOLLOWING]}`}
            element={<ProfileEngagementsPage {...props} selectedStat={'following'} />}
          />
          <Route
            path={`:profileId${menuRoute[EDIT]}`}
            element={<ProfilePage editMode={true} {...props} />}
          />
          <Route
            element={
              <NoProfileFound
                titleLabel={t("Etherean profile doesn't exist 😅")}
                subtitleLine1Label={t("You can check Ethereum World's")}
                subtitleLine2Label={t('or')}
                cta1Label={t('Feed')}
                cta2Label={t('log in')}
                onGoToFeedClick={() => {
                  //@TODO
                }}
                onCTAClick={() => {
                  //@TODO
                }}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};
export default AppRoutes;
