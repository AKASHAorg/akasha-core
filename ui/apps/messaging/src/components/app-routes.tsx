import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import * as React from 'react';
import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';
import ChatPage from './chat-page';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getHubUser, getMessages } from '../api/message';
import { db } from '../db/messages-db';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;
  const loggedUserId = React.useMemo(() => loggedProfileData?.did?.id, [loggedProfileData]);

  // const getHubUserCallback = React.useCallback(getHubUser, [loggedUserId]);

  const [fetchingMessages, setFetchingMessages] = React.useState(false);

  const fetchMessagesCallback = React.useCallback(async () => {
    setFetchingMessages(true);
    // get all messages from textile inbox, currently filterring by user pubkey is not supported
    const messagesData = await getMessages();
    const allMessages = messagesData.data
      ?.map(res => {
        if (res.body.content) {
          const chatPartnerId = res.from === loggedUserId ? res.to : res.from;
          return {
            content: res.body.content?.slateContent,
            ethAddress: res.body.content?.author,
            timestamp: res.createdAt,
            name: null,
            from: res.from,
            to: res.to,
            read: res.read,
            id: res.id,
            loggedUserId: loggedUserId,
            chatPartnerId,
          };
        }
        return null;
      })
      .filter(Boolean);
    // add new messages, key second param is not required since we have id as inbound index
    // db.messages.bulkPut(allMessages);
    setFetchingMessages(false);
  }, [loggedUserId]);

  React.useEffect(() => {
    fetchMessagesCallback();
  }, [fetchMessagesCallback]);

  return (
    <Router basename={props.baseRouteName}>
      <Helmet>
        <title>Message App | Akasha World</title>
      </Helmet>
      <Routes>
        <Route
          path={`${routes[MESSAGING]}`}
          element={<InboxPage {...props} loggedProfileData={loggedProfileData} />}
        ></Route>
        <Route
          path={`${routes[SETTINGS]}`}
          element={<SettingsPage {...props} loggedProfileData={loggedProfileData} />}
        ></Route>
        <Route
          path={`${routes[CHAT]}/:pubKey`}
          element={
            <ChatPage
              {...props}
              loggedProfileData={loggedProfileData}
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
