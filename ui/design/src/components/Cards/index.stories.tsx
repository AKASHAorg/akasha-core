/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import { IAppsData } from './apps-widget-card';
import { AppsWidgetCard, EntryCard, ProfileCard, TopicsWidgetCard } from './index';

const topicsDataSource = [
  { title: '#ethereumworld', subtitle: '6576 mentions' },
  { title: '#akashaworld', subtitle: '3204 mentions' },
  { title: '#cryptoworld', subtitle: '6576 mentions' },
];

const appsDataSource: IAppsData[] = [
  { title: 'GitCoin', subtitle: '123 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Augur', subtitle: '89 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Aragon', subtitle: '57 embedded cards', appIconType: 'app', iconSize: '40px' },
];

const profileData = {
  avatarImg: 'http://placebeard.it/640/480',
  profileImg: 'goldenrod',
  name: 'Gilbert The Bearded',
  userName: '@gilbert',
  userInfo:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: '15',
  following: '1876',
  apps: '12',
  profileType: 'user',
};
const dappData = {
  avatarImg: '',
  profileImg: '#CAF2F9;',
  name: 'Aragon',
  userName: '@aragonorg',
  userInfo:
    'Aragon is a project to empower freedom by creating tools for decentralized organizations to thrive. We believe the fate of humanity will be decided at the frontier of technological innovation.',
  users: '21896',
  actions: '12',
  profileType: 'dapp',
  mostPopularActions: ['Assign Tokens', 'Create a new vote', 'Check finance'],
};
const entryData = {
  user: 'AKASHA WORLD',
  userAvatar: 'http://placebeard.it/640/480',
  content:
    'We’re back in action, energized after an epic retreat in #verbier 🇨🇭 🤜💥🤛Here’s to everyone keeping us in their minds and hearts 🥂You’ve been in our hearts and minds as well! 🤗Looking forward to sharing our insights and plans in the coming days! 🚀#AKASHAReloaded #AKASHAFoundation',
  time: '1572036522',
  upvotes: 26,
  downvotes: 9,
  comments: [
    {
      user: 'Mariana Gomes',
      userAvatar: 'http://placebeard.it/640/480',
      content: 'Great Job!',
      upvotes: 3,
      downvotes: 0,
      time: '1572036522',
    },
    {
      user: 'Gigi Patratel',
      userAvatar: 'http://placebeard.it/640/480',
      content: 'Amazing!',
      upvotes: 2,
      downvotes: 1,
      time: '1572036522',
    },
  ],
  quotes: [
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
    {
      user: 'Gigi Patratel',
      time: '1572036522',
      userAvatar: 'http://placebeard.it/640/480',
    },
  ],
};
const followingTitle = 'Following';
const appsTitle = 'Apps';
const aboutMeTitle = 'About';
const actionsTitle = 'Actions';
const mostPopularActionsTitle = 'Most Popular Actions';
const usersTitle = 'Users';
const commentsTitle = 'Comments';
const quotesTitle = 'Quotes';
const shareTitle = 'Share';
const editPostTitle = 'Edit Post';
const editCommentTitle = 'Edit Comment';
const copyLinkTitle = 'Copy Link';
const quotedByTitle = 'Quoted By';
const replyTitle = 'Reply';
const shareProfileTitle = 'Share Profile';
const commentInputPlaceholderTitle = 'Write a comment';
const commentInputPublishTitle = 'Publish';

storiesOf('Cards', module)
  .add('topics widget card', () => (
    <Box pad="none" align="center" height="224px" width="336px">
      <TopicsWidgetCard
        onClick={() => action('TopicsWidgetCard Clicked')('Synthetic Event')}
        margin={object('Margin', { margin: '0px' })}
        iconType={'hotTopics'}
        label={text('Text', 'Hot Topics')}
        labelColor={color('Color', '#132540')}
        dataSource={topicsDataSource}
      />
    </Box>
  ))
  .add('apps widget card', () => (
    <Box pad="none" align="center" height="224px" width="336px">
      <AppsWidgetCard
        onClick={() => action('AppsWidgetCard Clicked')('Synthetic Event')}
        margin={object('Margin', { margin: '0px' })}
        iconType={'trendingApps'}
        label={text('Text', 'Trending Apps')}
        labelColor={color('Color', '#132540')}
        dataSource={appsDataSource}
      />
    </Box>
  ))
  .add('profile card', () => (
    <Box pad="none" align="center" width="581px">
      <ProfileCard
        onClickApps={() => action('Apps Box Clicked')('Synthetic Event')}
        onClickFollowing={() => action('Following Box Clicked')('Synthetic Event')}
        margin={object('Margin', { margin: '0px' })}
        // @ts-ignore
        profileData={select('Profile Data', { dapp: dappData, user: profileData }, profileData)}
        userInfoTitle={text('About me', aboutMeTitle)}
        actionsTitle={text('Actions', actionsTitle)}
        mostPopularActionsTitle={text('Most popular actions', mostPopularActionsTitle)}
        followingTitle={text('Following', followingTitle)}
        appsTitle={text('Apps', appsTitle)}
        usersTitle={text('Users', usersTitle)}
        shareProfileText={text('Share Profile', shareProfileTitle)}
      />
    </Box>
  ))
  .add('entry card', () => (
    <Box pad="none" align="center" width="581px">
      <EntryCard
        entryData={object('Entry Data', entryData)}
        onClickAvatar={() => action('Avatar Clicked')('Synthetic Event')}
        onClickDownvote={() => action('Downvote Clicked')('Synthetic Event')}
        onClickUpvote={() => action('Upvote Clicked')('Synthetic Event')}
        commentsTitle={text('Comments title', commentsTitle)}
        quotesTitle={text('Quotes title', quotesTitle)}
        shareTitle={text('Share title', shareTitle)}
        editPostTitle={text('Edit post title', editPostTitle)}
        editCommentTitle={text('Edit comment title', editCommentTitle)}
        copyLinkTitle={text('Copy link title', copyLinkTitle)}
        quotedByTitle={text('Quoted By title', quotedByTitle)}
        replyTitle={text('Reply title', replyTitle)}
        fullEntry={boolean('Full Entry', false)}
        locale={select('Locale', { en: 'en', ro: 'ro', es: 'es' }, 'en')}
        commentInputPlaceholderTitle={text(
          'Comment input placeholder',
          commentInputPlaceholderTitle,
        )}
        commentInputPublishTitle={text('Comment input publish title', commentInputPublishTitle)}
        publishComment={() => action('Comment published')('Synthetic Event')}
        userAvatar={'https://www.stevensegallery.com/360/360'}
      />
    </Box>
  ));
