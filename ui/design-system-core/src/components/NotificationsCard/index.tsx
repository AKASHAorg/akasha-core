import React from 'react';
import { EntityTypes } from '@akashaorg/typings/ui';
import { formatRelativeTime } from '../../utils/time';
import BasicCardBox from '../BasicCardBox';
import BasicInfoCard from '../BasicInfoCard';
import Box from '../Box';
import Divider from '../Divider';
import ProfileAvatarNotificationApp from './ProfileAvatarNotificationApp';
import Spinner from '../Spinner';

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
  handleEntryClick: (itemId: string, itemType: EntityTypes) => void;
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
    emptyTitle,
    handleMessageRead,
    handleEntryClick,
    handleProfileClick,
    loggedIn,
  } = props;

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
            handleEntryClick(postID, EntityTypes.POST);
          }
        };
        break;
      case 'COMMENT_MENTION':
        label = mentionedCommentLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (replyID) {
            handleEntryClick(replyID, EntityTypes.REPLY);
          } else if (postID) {
            handleEntryClick(postID, EntityTypes.POST);
          }
        };
        break;
      case 'NEW_COMMENT':
        label = replyToPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID, EntityTypes.POST);
          }
        };
        break;
      case 'NEW_COMMENT_REPLY':
        label = replyToReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (replyID) {
            handleEntryClick(replyID, EntityTypes.REPLY);
          }
        };
        break;
      case 'POST_QUOTE':
        label = repostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID, EntityTypes.POST);
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
            handleEntryClick(moderatedID, EntityTypes.POST);
          }
        };
        break;
      case 'MODERATED_REPLY':
        label = moderatedReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            handleEntryClick(moderatedID, EntityTypes.REPLY);
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
    const fullLabel = (
      <>
        <span className="text(secondaryLight dark:secondaryDark)">{name}</span> {' ' + label}
      </>
    );

    const relativeTime = formatRelativeTime(Math.floor(notif.createdAt / 1000000000), 'en');
    return (
      <div key={index}>
        <BasicCardBox pad="py-3 pl-4" onClick={clickHandler} style="flex-row" round="none">
          <ProfileAvatarNotificationApp
            profileId={profileData.did.id}
            avatarImage={profileData.avatar}
            label={fullLabel}
            info={relativeTime}
            onClickAvatar={clickHandler}
            onClick={clickHandler}
            active={!notif.read}
          />
        </BasicCardBox>
        <Divider />
      </div>
    );
  };

  return (
    <BasicCardBox pad="p-0">
      {loggedIn && !isFetching && notifications.length === 0 && (
        <BasicInfoCard titleLabel={emptyTitle} />
      )}
      {loggedIn && notifications.length !== 0 && (
        <div>
          {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
          {isFetching && (
            <Box customStyle="py-4">
              <Spinner />
            </Box>
          )}
        </div>
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
