import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import routes, { HOME, rootRoute } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = () => {
  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[HOME]}>
            <Box>Settings...</Box>
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
