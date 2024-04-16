import type { Meta, StoryObj } from '@storybook/react';
import NotificationsCard, { NotificationsCardProps } from '../../components/NotificationsCard';

const meta: Meta<NotificationsCardProps> = {
  title: 'DSComponents/Cards/NotificationsCard',
  component: NotificationsCard,
  tags: ['autodocs'],
  argTypes: {
    notifications: { control: 'object' },
    isFetching: { control: 'boolean' },
    emptyTitle: { control: 'text' },
    emptySubtitle: { control: 'text' },
    markAsReadLabel: { control: 'text' },
    repostLabel: { control: 'text' },
    replyToPostLabel: { control: 'text' },
    replyToReplyLabel: { control: 'text' },
    followingLabel: { control: 'text' },
    mentionedPostLabel: { control: 'text' },
    mentionedCommentLabel: { control: 'text' },
    moderatedPostLabel: { control: 'text' },
    moderatedReplyLabel: { control: 'text' },
    moderatedAccountLabel: { control: 'text' },
    loggedIn: { control: 'boolean' },
    handleEntryClick: { action: 'entry clicked' },
    handleMessageRead: { action: 'message read' },
    handleProfileClick: { action: 'profile clicked' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<NotificationsCardProps>;

export const Default: Story = {
  args: {
    notifications: [
      {
        body: {
          value: {
            author: {
              name: 'Dr. Flynn',
              userName: 'thedrflynn',
              ethAddress: '0x003410490050000320006570034567114572000',
              avatar: { url: 'https://placebeard.it/360x360' },
            },
            follower: {
              name: 'Dr. Flynn',
              userName: 'thedrflynn',
              ethAddress: '0x003410490050000320006570034567114572000',
              avatar: { url: 'https://placebeard.it/360x360' },
            },
            postID: '01f3st44m5g3tc6419b92zyd21',
          },
          property: 'POST_MENTION',
        },
        createdAt: Date.now(),
      },
    ],
    isFetching: false,
    emptyTitle: 'All clear',
    markAsReadLabel: 'Mark as read',
    repostLabel: 'reposted your post',
    replyToPostLabel: 'replied to your post',
    replyToReplyLabel: 'replied to your reply',
    followingLabel: 'is now following you',
    mentionedPostLabel: 'mentioned you in a post',
    mentionedCommentLabel: 'mentioned you in a comment',
    moderatedPostLabel: 'moderated your post',
    moderatedReplyLabel: 'moderated your reply',
    moderatedAccountLabel: 'suspended your account',
    emptySubtitle: "You don't have any new notifications!",
    loggedIn: true,
    handleEntryClick: () => ({}),
    handleMessageRead: () => ({}),
    handleProfileClick: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
