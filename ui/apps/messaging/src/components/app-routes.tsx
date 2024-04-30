import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ChatPage from './chat-page';
import InboxPage from './inbox/inbox-page';
import SettingsPage from './settings-page';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import routes, { CHAT, MESSAGING, SETTINGS } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const [fetchingMessages, setFetchingMessages] = useState(false);
  const { baseRouteName, logger, worldConfig } = useRootComponentProps();
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
      type: 'script-error',
      title: t('Error in messaging app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <HelmetProvider>
        <Helmet>
          <title>Message App |{worldConfig.title}</title>
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
      </HelmetProvider>
    </Router>
  );
};

export default AppRoutes;
