/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon';
import IconButton from './icon-button';
import IconLink from './icon-link';
import ProfileAvatarButton from './profile-avatar-button';
import VoteIconButton from './vote-icon-button';

storiesOf('Buttons|IconLink', module).add('default', () => (
  <Box pad="large" align="start">
    <IconLink
      label="Click Me"
      onClick={() => {}}
      iconPosition="start"
      size="small"
      icon={<Icon type="wallet" />}
    />
  </Box>
));

storiesOf('Buttons|IconButton', module)
  .add('secondary (default)', () => (
    <Box pad="large" align="start">
      <IconButton onClick={() => {}} icon={<Icon type="wallet" />} label="My Wallet" />
    </Box>
  ))
  .add('primary', () => (
    <Box pad="large" align="start">
      <IconButton
        primary={true}
        onClick={() => {}}
        icon={<Icon type="wallet" />}
        label="My Wallet"
      />
    </Box>
  ))
  .add('share', () => (
    <Box pad="large" align="start">
      <IconButton
        share={true}
        onClick={() => {}}
        icon={<Icon type="share" />}
        label="Share Profile"
      />
    </Box>
  ));

storiesOf('Buttons|ProfileIconButton', module).add('default', () => (
  <Box pad="large" align="start">
    <ProfileAvatarButton
      avatarImage="https://placebeard.it/360x360"
      onClick={() => action('Avatar Button Click')()}
      label="AKASHA World"
      info="22 July 2019 | 20h30"
    />
  </Box>
));

storiesOf('Buttons|VoteIconButton', module).add('upvote -default', () => (
  <Box pad="large" align="start">
    <VoteIconButton voteType="upvote" voteCount={24} onClick={() => {}} />
  </Box>
));

storiesOf('Buttons|VoteIconButton', module).add('upvote -voted', () => (
  <Box pad="large" align="start">
    <VoteIconButton voteType="upvote" voteCount={24} onClick={() => {}} voted={true} />
  </Box>
));

storiesOf('Buttons|VoteIconButton', module).add('downvote -default', () => (
  <Box pad="large" align="start">
    <VoteIconButton voteType="downvote" voteCount={24} onClick={() => {}} />
  </Box>
));

storiesOf('Buttons|VoteIconButton', module).add('downvote -voted', () => (
  <Box pad="large" align="start">
    <VoteIconButton voteType="downvote" voteCount={24} onClick={() => {}} voted={true} />
  </Box>
));
