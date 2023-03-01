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
          <Route path={route[TOS]} element={<TermsOfService />} />
          <Route path={route[TOU]} element={<TermsOfUse />} />
          <Route path={route[PP]} element={<PrivacyPolicy />} />
          <Route path={route[COC]} element={<CodeOfConduct />} />
          <Route path={route[DG]} element={<DeveloperGuidelines />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
