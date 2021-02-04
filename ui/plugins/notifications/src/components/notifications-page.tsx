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
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    loggedEthAddress: loginState.ethAddress,
  });

  const handleMarkAllAsRead = () => {
    notificationsState.forEach((notif: any) => {
      notificationsActions.markMessageAsRead(notif.id);
    });
  };

  const handleAvatarClick = (profileEthAddress: string) => {
    singleSpa.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handlePostClick = (authorEthAddress: string, entryId: string) => {
    singleSpa.navigateToUrl(`/AKASHA-app/posts/${authorEthAddress}/post/${entryId}`);
  };

  const renderNotifCard = (notif: any, index: number) => {
    const profileData = notif.body.value.author || notif.body.value.follower;
    let label;
    let clickHandler;
    switch (notif.body.property) {
      case 'POST_MENTION':
        label = t('mentioned you in a post');
        clickHandler = () => handlePostClick(profileData.ethAddress, notif.body.value.postID);
        break;
      case 'NEW_FOLLOWER':
        label = t('is now following you');
        clickHandler = () => handleAvatarClick(profileData.ethAddress);
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
        <Button
          label={t('Mark as Read')}
          primary={true}
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
        <Box pad="medium" gap="medium">
          <Box direction="row" justify="between">
            <Text weight="bold">{t('Notifications')}</Text>
            <Icon
              size="sm"
              type="checkSimple"
              primaryColor={true}
              clickable={true}
              onClick={handleMarkAllAsRead}
            />
          </Box>
          {notificationsState.map((notif: any, index: number) => renderNotifCard(notif, index))}
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default NotificationsPage;
