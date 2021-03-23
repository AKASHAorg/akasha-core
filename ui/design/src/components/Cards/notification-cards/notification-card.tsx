import React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import { MainAreaCardBox } from '../common/basic-card-box';
import { Icon } from '../../Icon';
import { formatRelativeTime } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import styled from 'styled-components';
import Spinner from '../../Spinner/index';
import Tooltip from '../../Tooltip/tooltip';

const BlueDot = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.accent};
`;

const StyledNotifBox = styled(Box)`
  cursor: pointer;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  &:hover {
    background-color: ${props => props.theme.colors.accentOpacity};
  }
`;

const IconDiv = styled(Box)`
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  &:hover {
    background-color: ${props => props.theme.colors.accentOpacity};
    div:nth-child(1) {
      & * {
        stroke: ${props => props.theme.colors.accent};
      }
    }
  }
`;

export interface ITagProfileCard {
  // data
  notifications: any[];
  isFetching?: boolean;
  // labels
  notificationsLabel?: string;
  followingLabel?: string;
  mentionedLabel?: string;
  repostLabel?: string;
  replyLabel?: string;
  markAsReadLabel?: string;
  // handlers
  handleMessageRead: (notifId: string) => void;
  handleEntryClick: (entryId: string) => void;
  handleProfileClick: (pubKey: string) => void;
  handleNavBack: () => void;
  // error component
  errorLoader: React.ReactElement;
}

const NotificationsCard: React.FC<ITagProfileCard> = props => {
  const {
    notifications,
    isFetching,
    notificationsLabel,
    followingLabel,
    mentionedLabel,
    replyLabel,
    repostLabel,
    markAsReadLabel,
    handleMessageRead,
    handleEntryClick,
    handleProfileClick,
    handleNavBack,
    errorLoader,
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
      <StyledNotifBox
        key={index}
        direction="row"
        justify="between"
        align="center"
        pad="small"
        onClick={clickHandler}
      >
        <ProfileAvatarButton
          ethAddress={profileData.ethAddress}
          avatarImage={profileData.avatar}
          label={fullLabel}
          info={relativeTime}
          onClickAvatar={() => handleProfileClick(profileData.pubKey)}
          active={notif.readAt === 0}
        />
        <BlueDot
          onClick={() => {
            handleMessageRead(notif.id);
          }}
        />
      </StyledNotifBox>
    );
  };

  return (
    <MainAreaCardBox>
      {isFetching && (
        <Box pad="large">
          <Spinner />
        </Box>
      )}
      {!isFetching && notifications.length === 0 && errorLoader}
      {!isFetching && notifications.length !== 0 && (
        <Box pad={isMobileOnly ? 'xsmall' : 'small'}>
          <Box
            direction="row"
            justify="between"
            align="center"
            pad={{ left: 'small', bottom: 'medium' }}
          >
            {isMobileOnly && <Icon type="arrowLeft" primaryColor={true} onClick={handleNavBack} />}
            <Text size="xlarge" weight="bold">
              {notificationsLabel}
            </Text>
            <Tooltip
              dropProps={{ align: { right: 'left' } }}
              message={`${markAsReadLabel}`}
              plain={true}
              caretPosition={'right'}
            >
              <IconDiv>
                <Icon
                  size="xs"
                  type="checkSimple"
                  primaryColor={true}
                  clickable={true}
                  onClick={handleMarkAllAsRead}
                />
              </IconDiv>
            </Tooltip>
          </Box>
          {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
        </Box>
      )}
    </MainAreaCardBox>
  );
};
NotificationsCard.defaultProps = {
  notificationsLabel: 'Notifications',
  mentionedLabel: 'mentioned you in a post',
  replyLabel: 'replied to your post',
  followingLabel: 'is now following you',
  repostLabel: 'reposted your post',
  markAsReadLabel: 'Mark as read',
};
export { NotificationsCard };
