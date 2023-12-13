import React from 'react';

import { EntityTypes, type Image } from '@akashaorg/typings/lib/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

import BasicInfoCard from './basic-info-card';
import ProfileAvatarNotificationApp from './profile-avatar-notification-app';
import { formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';

export type NotificationsCardProps = {
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
  handleProfileClick: (id: string) => void;
  transformSource: (src: Image) => Image;
  loggedIn?: boolean;
};

const NotificationsCard: React.FC<NotificationsCardProps> = props => {
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
    transformSource,
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
            handleEntryClick(postID, EntityTypes.BEAM);
          }
        };
        break;
      case 'COMMENT_MENTION':
        label = mentionedCommentLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (replyID) {
            handleEntryClick(replyID, EntityTypes.REFLECT);
          } else if (postID) {
            handleEntryClick(postID, EntityTypes.BEAM);
          }
        };
        break;
      case 'NEW_COMMENT':
        label = replyToPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID, EntityTypes.BEAM);
          }
        };
        break;
      case 'NEW_COMMENT_REPLY':
        label = replyToReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (replyID) {
            handleEntryClick(replyID, EntityTypes.REFLECT);
          }
        };
        break;
      case 'POST_QUOTE':
        label = repostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (postID) {
            handleEntryClick(postID, EntityTypes.BEAM);
          }
        };
        break;
      case 'NEW_FOLLOWER':
        label = followingLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          handleProfileClick(profileData.did.id);
        };
        break;
      case 'MODERATED_POST':
        label = moderatedPostLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            handleEntryClick(moderatedID, EntityTypes.BEAM);
          }
        };
        break;
      case 'MODERATED_REPLY':
        label = moderatedReplyLabel;
        clickHandler = () => {
          handleMessageRead(notif.id);
          if (moderatedID) {
            handleEntryClick(moderatedID, EntityTypes.REFLECT);
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

    const relativeTime = formatRelativeTime(
      Math.floor(notif.createdAt / 1000000000).toString(),
      'en',
    );
    return (
      <Stack key={index} customStyle={`${index === notifications.length - 1 ? 'basis-full' : ''}`}>
        <Stack key={index} padding="py-3 pl-4" customStyle="flex-row">
          <ProfileAvatarNotificationApp
            profileId={profileData.did?.id}
            avatar={profileData.avatar}
            label={fullLabel}
            info={relativeTime}
            onClickAvatar={clickHandler}
            onClick={clickHandler}
            active={!notif.read}
            transformSource={transformSource}
          />
        </Stack>
        {index !== notifications.length - 1 && <Divider />}
      </Stack>
    );
  };

  return (
    <Card elevation={'1'} radius={16} customStyle="p-0 w-full grow flex-wrap">
      {loggedIn && !isFetching && notifications.length === 0 && (
        <BasicInfoCard titleLabel={emptyTitle} image={'/images/longbeam-notfound.webp'} />
      )}
      {loggedIn && notifications.length !== 0 && (
        <div>
          {notifications?.map((notif: any, index: number) => renderNotificationCard(notif, index))}
          {isFetching && (
            <Stack padding="py-4">
              <Spinner />
            </Stack>
          )}
        </div>
      )}
    </Card>
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
