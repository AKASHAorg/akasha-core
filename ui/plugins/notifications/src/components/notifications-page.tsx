import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
// import { useTranslation } from 'react-i18next';
import { useLoginState, useNotifications } from '@akashaproject/ui-awf-hooks';

const { Helmet, Box, Text, Button } = DS;

interface AppRoutesProps {
  onError?: (err: Error) => void;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  singleSpa: any;
}

const NotificationsPage: React.FC<AppRoutesProps> = props => {
  const { sdkModules, logger, globalChannel } = props;

  //   const { t } = useTranslation();

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger.error('useLoginState error %j', err);
    },
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [notificationsState, notificationsActions] = useNotifications({
    onError: (err: IAkashaError) => {
      logger.error('useNotifications error %j', err);
    },
    authService: props.sdkModules.auth.authService,
    loggedEthAddress: loginState.ethAddress,
  });

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      {notificationsState.map((notif: any, index: number) => (
        <Box key={index} width="20rem">
          <Text>{JSON.stringify(notif)}</Text>
          <Button
            label="Mark as Read"
            onClick={() => {
              notificationsActions.markMessageAsRead(notif.id);
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default NotificationsPage;
