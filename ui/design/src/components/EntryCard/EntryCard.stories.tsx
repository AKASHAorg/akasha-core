import React from 'react';
import { Box, Grommet } from 'grommet';

import EntryCard, { IEntryCardProps } from '.';
import { EntryCardHidden, IEntryCardHiddenProps } from '../EntryCard/entry-card-hidden';

import lightTheme from '../../styles/themes/light/light-theme';

import {
  entryData,
  shareLabel,
  flagAsLabel,
  repliesLabel,
  repostsLabel,
  bookmarkLabel,
  copyLinkLabel,
  bookmarkedLabel,
} from '../../utils/dummy-data';

export default {
  title: 'Cards/EntryCard',
  component: EntryCard,
  argTypes: {
    isBookmarked: { control: 'boolean' },
    isFollowingAuthor: { control: 'boolean' },
    shareLabel: { control: 'text' },
    flagAsLabel: { control: 'text' },
    repostsLabel: { control: 'text' },
    repliesLabel: { control: 'text' },
    bookmarkLabel: { control: 'text' },
    copyLinkLabel: { control: 'text' },
    bookmarkedLabel: { control: 'text' },
    repostLabel: { control: 'text' },
    sharePostLabel: { control: 'text' },
    profileAnchorLink: { control: 'text' },
    repliesAnchorLink: { control: 'text' },
    sharePostUrl: { control: 'text' },
    repostWithCommentLabel: { control: 'text' },
    shareTextLabel: { control: 'text' },
    loggedProfileEthAddress: { control: 'text' },
    awaitingModerationLabel: { control: 'text' },
    ctaLabel: { control: 'text' },
    locale: {
      control: {
        type: 'radio',
        options: ['en', 'ro', 'es'],
      },
    },
    onRepost: { action: 'clicked repost' },
    onEntryFlag: { action: 'clicked flag entry' },
    onClickAvatar: { action: 'clicked avatar' },
    onMentionClick: { action: 'clicked mention' },
    onEntryBookmark: { action: 'clicked bookmark entry' },
    handleFollowAuthor: { action: 'clicked follow author' },
    handleUnfollowAuthor: { action: 'clicked unfollow author' },
  },
};

const Template = (args: IEntryCardProps) => (
  <Grommet theme={lightTheme}>
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <EntryCard {...args} />
    </Box>
  </Grommet>
);

const TemplateHidden = (args: IEntryCardHiddenProps) => (
  <Grommet theme={lightTheme}>
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <EntryCardHidden {...args} />
    </Box>
  </Grommet>
);

const style = { height: 'auto' };

export const BaseEntryCard = Template.bind({});

BaseEntryCard.args = {
  style: style,
  isBookmarked: false,
  entryData: entryData,
  shareLabel: shareLabel,
  flagAsLabel: flagAsLabel,
  isFollowingAuthor: false,
  repostsLabel: repostsLabel,
  repliesLabel: repliesLabel,
  bookmarkLabel: bookmarkLabel,
  copyLinkLabel: copyLinkLabel,
  bookmarkedLabel: bookmarkedLabel,
  locale: 'en',
  repostLabel: 'Repost',
  sharePostLabel: 'Share Post',
  profileAnchorLink: '/profile',
  repliesAnchorLink: '/social-app/post',
  sharePostUrl: 'https://ethereum.world',
  repostWithCommentLabel: 'Repost with comment',
  shareTextLabel: 'Share this post with your friends',
  loggedProfileEthAddress: '0x003410499401674320006570047391024572000',
  onRepost: () => null,
  onEntryFlag: () => null,
  onClickAvatar: () => null,
  onMentionClick: () => null,
  onEntryBookmark: () => null,
  handleFollowAuthor: () => null,
  handleUnfollowAuthor: () => null,
};

export const BaseEntryCardHidden = TemplateHidden.bind({});

BaseEntryCardHidden.args = {
  awaitingModerationLabel: 'You have reported this post. It is awaiting moderation.',
  ctaLabel: 'See it anyway',
};
