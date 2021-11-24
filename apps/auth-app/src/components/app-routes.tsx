import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import routes, { rootRoute, SIGN_IN, SIGN_UP, SIGN_UP_USERNAME } from '../routes';
import SignUp from './sign-up';
import SignIn from './sign-in';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  // const { layoutConfig } = props;

  return (
    <Box>
      <Router>
        <Switch>
          <Route path={`${routes[SIGN_UP_USERNAME]}`}>
            <div>
              <SignUp activeIndex={4} {...props} />
            </div>
          </Route>
          <Route path={routes[SIGN_UP]}>
            <div>
              <SignUp {...props} />
            </div>
          </Route>
          <Route path={routes[SIGN_IN]}>
            <div>
              <SignIn {...props} />
            </div>
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[SIGN_IN]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
