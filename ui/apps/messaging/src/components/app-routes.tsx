import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import InboxPage from './inbox-page';
import SettingsPage from './settings-page';
import ChatPage from './chat-page';
// import { sendMessage } from '../api/message';

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
        {/* const MessageForm = () => {
  const [to, setTo] = React.useState('');
  const submitForm = async publish => {
    const result = await sendMessage(to, publish);
    console.info(result);
  };
  return (
    <form>
      <input type={'text'} placeholder={'to'} onChange={ev => setTo(ev.target.value)} />
      <CommentEditor
        ethAddress={undefined}
        onPublish={submitForm}
        getLinkPreview={undefined}
        getMentions={undefined}
        getTags={undefined}
      ></CommentEditor>
      <button type={'submit'}>Send message</button>
    </form>
  );
};

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
      <Routes>
        {/*<>*/}
        {/*  <Helmet>*/}
        {/*    <title>My Bookmarks | Ethereum World</title>*/}
        {/*  </Helmet>*/}
        {/*</>*/}
        {/* <Route path={`${routes[MESSAGING]}`} element={<MessageForm />}></Route> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
