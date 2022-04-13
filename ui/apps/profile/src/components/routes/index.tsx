import DS from '@akashaorg/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/ui-awf-typings/lib/app-loader';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const { t } = useTranslation('app-profile');

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
          <Route path={[`${rootRoute}/:pubKey`, menuRoute[MY_PROFILE]]}>
            <ProfilePage
              {...props}
              loggedProfileData={loggedProfileQuery.data}
              showLoginModal={showLoginModal}
              loginState={loginQuery.data}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
