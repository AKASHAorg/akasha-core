import * as React from 'react';
import DS from '@akashaproject/design-system';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { default as subRoutes, ENS_EDIT_PAGE, SETTINGS_PAGE, rootRoute } from '../../routes';
import EnsEditPage from './ens-edit-page';
import EnsSettingsPage from './ens-settings-page';
import { ActionMapper } from 'easy-peasy';
import { getProfileStore, ProfileStateModel } from '../../state/profile-state';

const { useGlobalLogin } = DS;

interface RoutesProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
}

const Routes: React.FC<RoutesProps> = props => {
  const { sdkModules, globalChannel, logger } = props;
  const Profile = getProfileStore(sdkModules, logger);
  const onLoginSuccess = Profile.useStoreActions(
    (act: ActionMapper<ProfileStateModel, '1'>) => act.handleLoginSuccess,
  );
  const onLoginError = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.handleLoginError,
  );

  useGlobalLogin(globalChannel, onLoginSuccess, onLoginError);

  return (
    <Router>
      <Switch>
        <Route path={subRoutes[ENS_EDIT_PAGE]}>
          <EnsEditPage sdkModules={sdkModules} globalChannel={globalChannel} logger={logger} />
        </Route>
        <Route path={subRoutes[SETTINGS_PAGE]}>
          <EnsSettingsPage sdkModules={sdkModules} globalChannel={globalChannel} logger={logger} />
        </Route>
        {/* Make the edit page default landing page for this app
                          404 routes gets redirected to this page also */}
        <Redirect push={true} from={rootRoute} to={subRoutes[ENS_EDIT_PAGE]} exact={true} />
      </Switch>
    </Router>
  );
};

export default Routes;
