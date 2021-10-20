import React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';
import { formatRelativeTime } from '../../utils/time';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { BlueDot, IconDiv, StyledNotifBox } from './styled-notifications';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
import ErrorLoader from '../ErrorLoader';

export interface INotificationsCard {
  // data
  notifications: any[];
  isFetching?: boolean;
  // labels
  notificationsLabel?: string;
  followingLabel?: string;
  mentionedPostLabel?: string;
  mentionedCommentLabel?: string;
  repostLabel?: string;
  replyLabel?: string;
  markAsReadLabel?: string;
  moderatedPostLabel?: string;
  moderatedReplyLabel?: string;
  moderatedAccountLabel?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  // handlers
  handleMessageRead: (notifId: string) => void;
  handleEntryClick: (entryId: string) => void;
  handleProfileClick: (pubKey: string) => void;
  handleNavBack: () => void;
}

const NotificationsCard: React.FC<INotificationsCard> = props => {
  const {
    notifications,
    isFetching,
    notificationsLabel,
    followingLabel,
    mentionedPostLabel,
    mentionedCommentLabel,
    replyLabel,
    repostLabel,
    moderatedPostLabel,
    moderatedReplyLabel,
    moderatedAccountLabel,
    markAsReadLabel,
    emptyTitle,
    emptySubtitle,
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
    const postID = Array.isArray(notif.body?.value?.postID)
      ? notif.body?.value?.postID[0]
      : notif.body?.value?.postID;
    const moderatedID = notif.body?.value?.contentID;
    // use this when we have routing available for comments
    // const commentID = Array.isArray(notif.body?.value?.commentID)
    //   ? notif.body?.value?.commentID[0]
    //   : notif.body?.value?.commentID;
    switch (notif.body.property) {
      case 'POST_MENTION':
        label = mentionedPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID);
          }
        };
        break;
      case 'COMMENT_MENTION':
        label = mentionedCommentLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID);
          }
        };
        break;
      case 'NEW_COMMENT':
        label = replyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID);
          }
        };
        break;
      case 'POST_QUOTE':
        label = repostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID);
          }
        };
        break;
      case 'NEW_FOLLOWER':
        label = followingLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          handleProfileClick(profileData.pubKey);
        };
        break;
      case 'MODERATED_POST':
        label = moderatedPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            handleEntryClick(moderatedID);
          }
        };
        break;
      case 'MODERATED_REPLY':
        label = moderatedReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            // need to change to the reply view page later
            handleEntryClick(moderatedID);
          }
        };
        break;
      case 'MODERATED_ACCOUNT':
        label = moderatedAccountLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            handleProfileClick(moderatedID);
          }
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
          onClickAvatar={clickHandler}
          onClick={clickHandler}
          active={!notif.read}
        />
        {!notif.read && (
          <Box
            pad="small"
            align="center"
            justify="center"
            onClick={ev => {
              handleMessageRead(notif.id);
              ev.stopPropagation();
              ev.preventDefault();
              return false;
            }}
          >
            <BlueDot />
          </Box>
        )}
      </StyledNotifBox>
    );
  };

  const renderHeader = () => (
    <Box direction="row" justify="between" align="center" pad={{ left: 'small', bottom: 'medium' }}>
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
  );

  const renderContent = () => (
    <>
      {isFetching && notifications.length === 0 && (
        <Box pad="large">
          <Spinner />
        </Box>
      )}
      {!isFetching && notifications.length === 0 && (
        <Box>
          {isMobileOnly && renderHeader()}
          <ErrorLoader
            type="missing-notifications"
            title={emptyTitle}
            details={emptySubtitle}
            style={
              isMobileOnly
                ? {
                    border: 'none',
                    boxShadow: 'none',
                  }
                : {}
            }
          />
        </Box>
      )}
      {notifications.length !== 0 && (
        <Box pad={isMobileOnly ? 'xsmall' : 'small'}>
          {renderHeader()}
          {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
          {isFetching && (
            <Box pad="small">
              <Spinner />
            </Box>
          )}
        </Box>
      )}
    </>
  );
  return (
    <>
      {isMobileOnly ? <Box>{renderContent()}</Box> : <BasicCardBox>{renderContent()}</BasicCardBox>}
    </>
  );
};
NotificationsCard.defaultProps = {
  notificationsLabel: 'Notifications',
  mentionedPostLabel: 'mentioned you in a post',
  mentionedCommentLabel: 'mentioned you in a comment',
  replyLabel: 'replied to your post',
  followingLabel: 'is now following you',
  repostLabel: 'reposted your post',
  markAsReadLabel: 'Mark as read',
  moderatedPostLabel: 'moderated your post',
  moderatedReplyLabel: 'moderated your reply',
  moderatedAccountLabel: 'suspended your account',
};
export default NotificationsCard;
