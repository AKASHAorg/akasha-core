import React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';
import { formatRelativeTime } from '../../utils/time';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { BlueDot, IconDiv, StyledNotifBox } from './styled-notifications';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
import InfoCard from '../InfoCard';

export interface INotificationsCard {
  // data
  notifications: Record<string, unknown>[];
  isFetching?: boolean;
  followingLabel?: string;
  mentionedPostLabel?: string;
  mentionedCommentLabel?: string;
  repostLabel?: string;
  replyToPostLabel?: string;
  replyToReplyLabel?: string;
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
  loggedIn?: boolean;
}

const NotificationsCard: React.FC<INotificationsCard> = props => {
  const {
    notifications,
    isFetching,
    followingLabel,
    mentionedPostLabel,
    mentionedCommentLabel,
    replyToPostLabel,
    replyToReplyLabel,
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
    loggedIn,
  } = props;

  const handleMarkAllAsRead = () => {
    notifications.forEach((notif: Record<string, string>) => {
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

    const replyID = Array.isArray(notif.body?.value?.replyTo)
      ? notif.body?.value?.replyTo[0]
      : notif.body?.value?.replyTo;

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
        label = replyToPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID);
          }
        };
        break;
      case 'NEW_COMMENT_REPLY':
        label = replyToReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (replyID) {
            handleEntryClick(replyID);
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
    <Box
      fill="horizontal"
      direction="row"
      justify="end"
      align="center"
      pad={{ left: 'small', bottom: 'xsmall' }}
    >
      <Tooltip
        dropProps={{ align: { right: 'left' } }}
        message={`${markAsReadLabel}`}
        plain={true}
        caretPosition={'right'}
      >
        <IconDiv margin={{ top: '0.3rem', right: '0.3rem' }}>
          <Icon size="md" type="checkSimple" clickable={true} onClick={handleMarkAllAsRead} />
        </IconDiv>
      </Tooltip>
    </Box>
  );

  return (
    <BasicCardBox>
      {loggedIn && !isFetching && notifications.length === 0 && (
        <InfoCard icon="notifications" title={emptyTitle} suggestion={emptySubtitle} />
      )}
      {loggedIn && notifications.length !== 0 && (
        <Box margin={{ horizontal: 'xsmall' }}>
          {renderHeader()}
          {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
          {isFetching && (
            <Box pad="small">
              <Spinner />
            </Box>
          )}
        </Box>
      )}
    </BasicCardBox>
  );
};
NotificationsCard.defaultProps = {
  mentionedPostLabel: 'mentioned you in a post',
  mentionedCommentLabel: 'mentioned you in a comment',
  replyToPostLabel: 'replied to your post',
  replyToReplyLabel: 'replied to your reply',
  followingLabel: 'is now following you',
  repostLabel: 'reposted your post',
  markAsReadLabel: 'Mark as read',
  moderatedPostLabel: 'moderated your post',
  moderatedReplyLabel: 'moderated your reply',
  moderatedAccountLabel: 'suspended your account',
};
export default NotificationsCard;
