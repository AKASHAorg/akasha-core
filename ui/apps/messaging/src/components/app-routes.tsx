import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

import ChatPage from './chat-page';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';

import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  // const getHubUserCallback = useCallback(getHubUser, [loggedUserId]);

  const [fetchingMessages, setFetchingMessages] = useState(false);

  const { baseRouteName } = useRootComponentProps();

  // @TODO: update this
  const fetchMessagesCallback = useCallback(async () => {
    setFetchingMessages(true);
    // get all messages from textile inbox, currently filterring by user pubkey is not supported
    // const messagesData = await getMessages();

    // const allMessages = messagesData.data
    //   ?.map(res => {
    //     if (res.body.content) {
    //       const chatPartnerId = res.from === loggedUserId ? res.to : res.from;
    //       return {
    //         content: res.body.content?.slateContent,
    //         ethAddress: res.body.content?.author,
    //         timestamp: res.createdAt,
    //         name: null,
    //         from: res.from,
    //         to: res.to,
    //         read: res.read,
    //         id: res.id,
    //         loggedUserId: loggedUserId,
    //         chatPartnerId,
    //       };
    //     }
    //     return null;
    //   })
    //   .filter(Boolean);

    // add new messages, key second param is not required since we have id as inbound index
    // db.messages.bulkPut(allMessages);
    setFetchingMessages(false);
  }, []);

  useEffect(() => {
    fetchMessagesCallback();
  }, [fetchMessagesCallback]);

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>Message App | AKASHA World</title>
      </Helmet>
      <Routes>
        <Route
          path={`${routes[MESSAGING]}`}
          element={<InboxPage loggedProfileData={loggedProfileData} />}
        ></Route>
        <Route
          path={`${routes[SETTINGS]}`}
          element={<SettingsPage loggedProfileData={loggedProfileData} />}
        ></Route>
        <Route
          path={`${routes[CHAT]}/:did`}
          element={
            <ChatPage loggedProfileData={loggedProfileData} fetchingMessages={fetchingMessages} />
          }
        ></Route>
        <Route path="/" element={<Navigate to={routes[MESSAGING]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
