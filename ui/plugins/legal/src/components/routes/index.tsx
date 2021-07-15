import DS from '@akashaproject/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import route, { TOS, TOU, PP, COC, DG } from '../../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TermsOfService from './terms-of-service';
import TermsOfUse from './terms-of-use';
import CodeOfConduct from './code-of-conduct';
import PrivacyPolicy from './privacy-policy';
import DeveloperGuidelines from './developer-guidelines';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  return (
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
          <Route path={route[DG]}>
            <DeveloperGuidelines {...props} />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
