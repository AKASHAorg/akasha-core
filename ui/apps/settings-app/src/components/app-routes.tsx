import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import SettingsPage from './settings-page';

import routes, { HOME, rootRoute } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[HOME]}>
            <SettingsPage {...props} />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
