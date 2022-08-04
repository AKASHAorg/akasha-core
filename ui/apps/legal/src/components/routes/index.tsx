import DS from '@akashaorg/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import route, { TOS, TOU, PP, COC, DG } from '../../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
import TermsOfService from './terms-of-service';
import TermsOfUse from './terms-of-use';
import CodeOfConduct from './code-of-conduct';
import PrivacyPolicy from './privacy-policy';
import DeveloperGuidelines from './developer-guidelines';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          <Route path={route[TOS]} element={<TermsOfService {...props} />} />
          <Route path={route[TOU]} element={<TermsOfUse {...props} />} />
          <Route path={route[PP]} element={<PrivacyPolicy {...props} />} />
          <Route path={route[COC]} element={<CodeOfConduct {...props} />} />
          <Route path={route[DG]} element={<DeveloperGuidelines {...props} />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
