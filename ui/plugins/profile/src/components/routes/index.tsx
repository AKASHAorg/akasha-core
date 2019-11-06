import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyProfilePage from './my-profile';
import ProfilePage from './profile-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
  const [t] = useTranslation();
  return (
    <>
      <Router>
        <Switch>
          <Route path={`${activeWhenPath}/profiles`} render={() => <>A list of profiles</>} />
          <Route path={`${activeWhenPath}/p/my-profile`} component={MyProfilePage} />
          <Route path={`${activeWhenPath}/p/:profileId`} component={ProfilePage} />
          <Route path={`${activeWhenPath}/apps`} render={() => <>A list of apps</>} />
          <Route path={`${activeWhenPath}/app/:appId`} render={() => <>An app's profile page</>} />
          <Route render={() => <div>{t('Profile not found!')}</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
