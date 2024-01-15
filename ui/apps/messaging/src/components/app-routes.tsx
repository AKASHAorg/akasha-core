import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import ChatPage from './chat-page';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';

import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const authenticatedProfileReq = useGetLoginProfile();
  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  // const getHubUserCallback = useCallback(getHubUser, [loggedUserId]);

  const [fetchingMessages, setFetchingMessages] = useState(false);
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-messaging');

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

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in messaging app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>Message App | AKASHA World</title>
      </Helmet>
      <Routes>
        <Route
          path={`${routes[MESSAGING]}`}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <InboxPage authenticatedProfile={authenticatedProfile} />
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[SETTINGS]}`}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <SettingsPage authenticatedProfile={authenticatedProfile} />
            </ErrorBoundary>
          }
        />
        <Route
          path={`${routes[CHAT]}/:did`}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <ChatPage
                authenticatedProfile={authenticatedProfile}
                fetchingMessages={fetchingMessages}
              />
            </ErrorBoundary>
          }
        />
        <Route path="/" element={<Navigate to={routes[MESSAGING]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
