import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyProfilePage from './my-profile';
import ProfilePage from './profile-page';
import { Grommet, lightTheme } from '@akashaproject/design-system';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const [t] = useTranslation();
  return (
    <>
      <Router>
        <Grommet theme={lightTheme}>
          <Switch>
            <Route path={`${path}/list`} render={() => <>A list of profiles</>} />
            <Route path={`${path}/my-profile`} component={MyProfilePage} />
            <Route path={`${path}/:profileId`} component={ProfilePage} />
            <Route render={() => <div>{t('Profile not found!')}</div>} />
          </Switch>
        </Grommet>
      </Router>
    </>
  );
};

export default Routes;
