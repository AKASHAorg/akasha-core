import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLoginState, useNotifications } from '@akashaproject/ui-awf-hooks';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';

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
  ErrorInfoCard,
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

  const [notifErrors, notifErrorActions] = useErrorState({ logger });

  const [notificationsState, notificationsActions] = useNotifications({
    onError: notifErrorActions.createError,
    globalChannel: globalChannel,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    loggedEthAddress: loginState.ethAddress,
  });

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      return notificationsActions.getMessages();
    }
  }, [JSON.stringify(loginState)]);

  const handleMarkAllAsRead = () => {
    notificationsState.notifications.forEach((notif: any) => {
      notificationsActions.markMessageAsRead(notif.id);
    });
  };
  // @todo: extract routes from config
  const handleAvatarClick = (profilePubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${profilePubKey}`);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/AKASHA-app/post/${entryId}`);
  };

  const renderNotificationCard = (notif: any, index: number) => {
    const profileData = notif.body.value.author || notif.body.value.follower;
    let label;
    let clickHandler;
    // handle old mentions data structure
    const postID = Array.isArray(notif.body.value.postID)
      ? notif.body.value.postID[0]
      : notif.body.value.postID;
    switch (notif.body.property) {
      case 'POST_MENTION':
        label = t('mentioned you in a post');
        clickHandler = () => {
          handlePostClick(postID);
          notificationsActions.markMessageAsRead(notif.id);
        };
        break;
      case 'NEW_FOLLOWER':
        label = t('is now following you');
        clickHandler = () => {
          handleAvatarClick(profileData.pubKey);
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
          onClickAvatar={() => handleAvatarClick(profileData.pubKey)}
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
        <title>{t('My notifications')}</title>
      </Helmet>
      <ErrorInfoCard errors={notifErrors}>
        {(messages, hasCriticalErrors) => (
          <>
            {hasCriticalErrors && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={messages}
              />
            )}
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={messages}
              />
            )}
            {!hasCriticalErrors && (
              <BasicCardBox>
                {notificationsState.isFetching && (
                  <Box pad="large">
                    <Spinner />
                  </Box>
                )}
                {!notificationsState.isFetching &&
                  notificationsState.notifications.length === 0 && (
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
                      <Button
                        label={t('Mark all as read')}
                        primary={true}
                        onClick={handleMarkAllAsRead}
                      />
                    </Box>
                    {notificationsState.notifications.map((notif: any, index: number) =>
                      renderNotificationCard(notif, index),
                    )}
                  </Box>
                )}
              </BasicCardBox>
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default NotificationsPage;
