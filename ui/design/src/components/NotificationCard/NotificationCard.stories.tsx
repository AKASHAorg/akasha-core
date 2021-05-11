import React from 'react';
import { Grommet } from 'grommet';

import NotificationsCard, { INotificationsCard } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/NotificationsCard',
  component: NotificationsCard,
  argTypes: {
    handleMessageRead: { action: 'message read' },
    handleEntryClick: { action: 'entry clicked' },
    handleProfileClick: { action: 'profile clicked' },
    handleNavBack: { action: 'navigating to previous screen' },
  },
};

const Template = (args: INotificationsCard) => (
  <Grommet theme={lightTheme}>
    <NotificationsCard {...args} />
  </Grommet>
);

export const BaseNotificationCard = Template.bind({});

BaseNotificationCard.args = {
  notifications: [
    {
      body: {
        value: {
          author: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: 'https://placebeard.it/360x360',
          },
          follower: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: 'https://placebeard.it/360x360',
          },
          postID: '01f3st44m5g3tc6419b92zyd21',
        },
        property: 'POST_MENTION',
      },
    },
  ],
  isFetching: false,
  emptyTitle: 'All clear',
  markAsReadLabel: 'Mark as read',
  repostLabel: 'reposted your post',
  replyLabel: 'replied to your post',
  notificationsLabel: 'Notifications',
  followingLabel: 'is now following you',
  mentionedPostLabel: 'mentioned you in a post',
  mentionedCommentLabel: 'mentioned you in a comment',
  emptySubtitle: "You don't have any new notifications!",
};
