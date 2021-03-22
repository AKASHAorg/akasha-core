import React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import { MainAreaCardBox } from '../common/basic-card-box';
import { Icon } from '../../Icon';
import { formatRelativeTime } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import styled from 'styled-components';

const BlueDot = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.accent};
`;

export interface ITagProfileCard {
  // data
  notifications: any[];
  // labels
  notificationsLabel?: string;
  followingLabel?: string;
  mentionedLabel?: string;
  repostLabel?: string;
  replyLabel?: string;
  // handlers
  handleMessageRead: (notifId: string) => void;
  handleEntryClick: (entryId: string) => void;
  handleProfileClick: (pubKey: string) => void;
  handleNavBack: () => void;
}

const NotificationsCard: React.FC<ITagProfileCard> = props => {
  const {
    notifications,
    notificationsLabel,
    followingLabel,
    mentionedLabel,
    replyLabel,
    repostLabel,
    handleMessageRead,
    handleEntryClick,
    handleProfileClick,
    handleNavBack,
  } = props;

  const handleMarkAllAsRead = () => {
    notifications.forEach((notif: any) => {
      handleMessageRead(notif.id);
    });
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
        label = mentionedLabel;
        clickHandler = () => {
          handleEntryClick(postID);
          handleMessageRead(notif.id);
        };
        break;
      case 'POST_REPLY':
        label = replyLabel;
        clickHandler = () => {
          handleEntryClick(postID);
          handleMessageRead(notif.id);
        };
        break;
      case 'POST_REPOST':
        label = repostLabel;
        clickHandler = () => {
          handleEntryClick(postID);
          handleMessageRead(notif.id);
        };
        break;
      case 'NEW_FOLLOWER':
        label = followingLabel;
        clickHandler = () => {
          handleProfileClick(profileData.pubKey);
          handleMessageRead(notif.id);
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
          onClickAvatar={() => handleProfileClick(profileData.pubKey)}
        />
        <BlueDot
          onClick={() => {
            handleMessageRead(notif.id);
          }}
        />
      </Box>
    );
  };

  return (
    <MainAreaCardBox>
      <Box pad={isMobileOnly ? 'medium' : 'large'} gap="medium">
        <Box direction="row" justify="between" align="center">
          {isMobileOnly && <Icon type="arrowLeft" onClick={handleNavBack} />}
          <Text size="xlarge" weight="bold">
            {notificationsLabel}
          </Text>
          <Icon
            size="xs"
            type="checkSimple"
            primaryColor={true}
            clickable={true}
            onClick={handleMarkAllAsRead}
          />
        </Box>
        {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
      </Box>
    </MainAreaCardBox>
  );
};
NotificationsCard.defaultProps = {
  notificationsLabel: 'Notifications',
  mentionedLabel: 'mentioned you in a post',
  replyLabel: 'replied to your post',
  followingLabel: 'is now following you',
  repostLabel: 'reposted your post',
};
export { NotificationsCard };
