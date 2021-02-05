import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLoginState, useNotifications } from '@akashaproject/ui-awf-hooks';

const {
  Helmet,
  Box,
  Text,
  Button,
  BasicCardBox,
  Icon,
  ProfileAvatarButton,
  formatRelativeTime,
  ErrorLoader,
  Spinner,
} = DS;

interface AppRoutesProps {
  onError?: (err: Error) => void;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  singleSpa: any;
}

const NotificationsPage: React.FC<AppRoutesProps> = props => {
  const { sdkModules, logger, globalChannel, singleSpa } = props;

  const { t } = useTranslation();

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
    globalChannel: globalChannel,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    loggedEthAddress: loginState.ethAddress,
  });

  const handleMarkAllAsRead = () => {
    notificationsState.notifications.forEach((notif: any) => {
      notificationsActions.markMessageAsRead(notif.id);
    });
  };

  const handleAvatarClick = (profileEthAddress: string) => {
    singleSpa.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/AKASHA-app/post/${entryId}`);
  };

  const renderNotificationCard = (notif: any, index: number) => {
    const profileData = notif.body.value.author || notif.body.value.follower;
    let label;
    let clickHandler;
    switch (notif.body.property) {
      case 'POST_MENTION':
        label = t('mentioned you in a post');
        clickHandler = () => {
          handlePostClick(notif.body.value.postID);
          notificationsActions.markMessageAsRead(notif.id);
        };
        break;
      case 'NEW_FOLLOWER':
        label = t('is now following you');
        clickHandler = () => {
          handleAvatarClick(profileData.ethAddress);
          notificationsActions.markMessageAsRead(notif.id);
        };
        break;
      default:
        label = '';
        break;
    }
    const name = profileData.name || profileData.userName || profileData.ethAddress;
    const fullLabel = `${name} ${label}`;
    const relativeTime = formatRelativeTime(Math.floor(notif.createdAt / 1000000000), 'en');
    return (
      <Box key={index} direction="row" justify="between" align="center">
        <ProfileAvatarButton
          ethAddress={profileData.ethAddress}
          avatarImage={profileData.avatar}
          label={fullLabel}
          info={relativeTime}
          onClick={clickHandler}
          onClickAvatar={() => handleAvatarClick(profileData.ethAddress)}
        />
        <Icon
          size="xs"
          type="checkSimple"
          primaryColor={true}
          clickable={true}
          onClick={() => {
            notificationsActions.markMessageAsRead(notif.id);
          }}
        />
      </Box>
    );
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <BasicCardBox>
        {notificationsState.isFetching && (
          <Box pad="large">
            <Spinner />
          </Box>
        )}
        {!notificationsState.isFetching && notificationsState.notifications.length === 0 && (
          <ErrorLoader
            type="missing-notifications"
            title={t('All clear')}
            details={t("You don't have any new notifications!")}
          />
        )}
        {!notificationsState.isFetching && notificationsState.notifications.length !== 0 && (
          <Box pad="medium" gap="medium">
            <Box direction="row" justify="between" align="center">
              <Text size="large" weight="bold">
                {t('Notifications')}
              </Text>
              <Button label={t('Mark all as read')} primary={true} onClick={handleMarkAllAsRead} />
            </Box>
            {notificationsState.notifications.map((notif: any, index: number) =>
              renderNotificationCard(notif, index),
            )}
          </Box>
        )}
      </BasicCardBox>
    </Box>
  );
};

export default NotificationsPage;
