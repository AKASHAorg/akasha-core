import DS from '@akashaproject/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import route, { TOS, TOU, PP, COC } from '../../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Box, ViewportSizeProvider } = DS;

const Routes: React.FC<RootComponentProps> = _props => {
  return (
    <ViewportSizeProvider>
      <Router>
        <Box>
          <Switch>
            <Route path={route[TOS]} render={() => <>Terms of Service</>} />
            <Route path={route[TOU]} render={() => <>Terms of Use</>} />
            <Route path={route[PP]} render={() => <>Privacy Policy</>} />
            <Route path={route[COC]} render={() => <>Code of conduct</>} />
          </Switch>
        </Box>
      </Router>
    </ViewportSizeProvider>
  );
};

export default Routes;
