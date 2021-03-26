import DS from '@akashaproject/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import route, { TOS, TOU, PP, COC } from '../../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TermsOfService from './tos';
import TermsOfUse from './tou';
import CodeOfConduct from './coc';
import PrivacyPolicy from './pp';

const { Box, ViewportSizeProvider } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  return (
    <ViewportSizeProvider>
      <Router>
        <Box>
          <Switch>
            <Route path={route[TOS]}>
              <TermsOfService {...props} />
            </Route>
            <Route path={route[TOU]}>
              <TermsOfUse {...props} />
            </Route>
            <Route path={route[PP]}>
              <PrivacyPolicy {...props} />
            </Route>
            <Route path={route[COC]}>
              <CodeOfConduct {...props} />
            </Route>
          </Switch>
        </Box>
      </Router>
    </ViewportSizeProvider>
  );
};

export default Routes;
