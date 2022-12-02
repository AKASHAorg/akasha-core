import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DS from '@akashaorg/design-system';

import routes, { CONNECT, SIGN_IN, SIGN_UP, SIGN_UP_USERNAME, WELCOME } from '../routes';
import SignUp from './sign-up';
import SignIn from './sign-in';
import Welcome from './welcome';
import Connect from './connect';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route
            path={`${routes[SIGN_UP_USERNAME]}`}
            element={
              <div>
                <SignUp activeIndex={4} {...props} />
              </div>
            }
          />
          <Route
            path={routes[SIGN_UP]}
            element={
              <div>
                <SignUp {...props} />
              </div>
            }
          />
          <Route
            path={routes[SIGN_IN]}
            element={
              <div>
                <SignIn {...props} />
              </div>
            }
          />
          <Route
            path={routes[WELCOME]}
            element={
              <div>
                <Welcome {...props} />
              </div>
            }
          />

          <Route
            path={routes[CONNECT]}
            element={
              <div>
                <Connect {...props} />
              </div>
            }
          />

          <Route path="/" element={<Navigate to={routes[SIGN_IN]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
