import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import InboxPage from './inbox-page';
import SettingsPage from './settings-page';
import ChatPage from './chat-page';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router>
      <Helmet>
        <title>Message App | Ethereum World</title>
      </Helmet>
      <Routes>
        <Route path={`${routes[MESSAGING]}`} element={<InboxPage {...props} />}></Route>
        <Route path={`${routes[SETTINGS]}`} element={<SettingsPage {...props} />}></Route>
        <Route path={`${routes[CHAT]}/:pubKey`} element={<ChatPage {...props} />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
