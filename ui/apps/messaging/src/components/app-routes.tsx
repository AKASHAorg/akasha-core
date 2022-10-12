import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';
import ChatPage from './chat-page';
import { useGetLogin, logError } from '@akashaorg/ui-awf-hooks';
import { getHubUser, getMessages } from '../api/message';
import { db } from '../db/messages-db';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();
  const loginState = loginQuery?.data;
  const loggedUserPubKey = React.useMemo(() => loginState?.pubKey, [loginState]);

  const getHubUserCallback = React.useCallback(getHubUser, [loggedUserPubKey]);

  const [fetchingMessages, setFetchingMessages] = React.useState(false);

  const fetchMessagesCallback = React.useCallback(async () => {
    setFetchingMessages(true);
    // get all messages from textile inbox, currently filterring by user pubkey is not supported
    const messagesData = await getMessages();
    const allMessages = messagesData
      ?.map(res => {
        if (res.body.content) {
          const chatPartnerPubKey = res.from === loggedUserPubKey ? res.to : res.from;
          return {
            content: res.body.content?.slateContent,
            ethAddress: res.body.content?.author,
            timestamp: res.createdAt,
            name: null,
            from: res.from,
            to: res.to,
            read: res.read,
            id: res.id,
            loggedUserPubKey: loggedUserPubKey,
            chatPartnerPubKey,
          };
        }
        return null;
      })
      .filter(Boolean);
    // add new messages, key second param is not required since we have id as inbound index
    db.messages.bulkPut(allMessages);
    setFetchingMessages(false);
  }, [loggedUserPubKey]);

  React.useEffect(() => {
    fetchMessagesCallback();
  }, [fetchMessagesCallback]);

  const subCallback = React.useCallback(
    async (reply?: any, err?: Error) => {
      if (err) {
        return logError('messaging-app.watchInbox', err);
      }
      if (!reply?.message) return;
      if (reply.message.readAt === 0) {
        const pubKey = reply.message.from;
        if (pubKey !== loggedUserPubKey) {
          let unreadChats = [];
          const unreadChatsStorage = localStorage.getItem('Unread Chats');
          if (unreadChatsStorage) {
            unreadChats = JSON.parse(unreadChatsStorage);
          }
          if (!unreadChats.includes(pubKey)) {
            unreadChats.push(pubKey);
          }
          // mark this conversation as having new messages
          localStorage.setItem('Unread Chats', JSON.stringify(unreadChats));
        }
      }
      // replace with adding decrytped message directly to db
      await fetchMessagesCallback();
    },
    [fetchMessagesCallback, loggedUserPubKey],
  );

  React.useEffect(() => {
    let sub;
    (async () => {
      const user = await getHubUserCallback();
      const mailboxId = await user.getMailboxID();
      sub = user.watchInbox(mailboxId, subCallback);
    })();
    return () => {
      if (sub) {
        sub.close();
        sub = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHubUserCallback]);

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
        <Route
          path={`${routes[SETTINGS]}`}
          element={<SettingsPage {...props} loginState={loginQuery?.data} />}
        ></Route>
        <Route
          path={`${routes[CHAT]}/:pubKey`}
          element={
            <ChatPage
              {...props}
              loginState={loginQuery?.data}
              fetchingMessages={fetchingMessages}
            />
          }
        ></Route>
        <Route path="/" element={<Navigate to={routes[MESSAGING]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
