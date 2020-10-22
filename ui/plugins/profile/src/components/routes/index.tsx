import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, PROFILE_LIST } from '../../routes';
import MyProfilePage from './my-profile-page';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const { t } = useTranslation();

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={menuRoute[PROFILE_LIST]} render={() => <>A list of profiles</>} />
          <Route path={menuRoute[MY_PROFILE]} component={MyProfilePage} />
          <Route
            path={`${path}/:profileId`}
            render={routeProps => <ProfilePage {...routeProps} {...props} />}
          />
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
