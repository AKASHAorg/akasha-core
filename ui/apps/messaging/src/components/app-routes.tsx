import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';
import ChatPage from './chat-page';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

  return (
    <Router basename={props.baseRouteName}>
      <Helmet>
        <title>Message App | Ethereum World</title>
      </Helmet>
      <Routes>
        <Route
          path={`${routes[MESSAGING]}`}
          element={<InboxPage {...props} loginState={loginQuery?.data} />}
        ></Route>
        <Route path={`${routes[SETTINGS]}`} element={<SettingsPage {...props} />}></Route>
        <Route path={`${routes[CHAT]}/:pubKey`} element={<ChatPage {...props} />}></Route>
        <Route path="/" element={<Navigate to={routes[MESSAGING]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
