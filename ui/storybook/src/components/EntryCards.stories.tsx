/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { boolean, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import {
  entryData,
  shareLabel,
  flagAsLabel,
  repliesLabel,
  repostsLabel,
  bookmarkLabel,
  copyLinkLabel,
  bookmarkedLabel,
  copyIPFSLinkLabel,
} from './cards-data';

const { Box, EntryCard } = DS;

storiesOf('Cards/Entry Cards', module).add('entry card', () => (
  <Box align="center" pad={{ top: '40px' }}>
    <EntryCard
      copyIPFSLinkLabel={text('Copy IPFS link Label', copyIPFSLinkLabel)}
      flagAsLabel={text('Flag as label', flagAsLabel)}
      style={{ height: 'auto' }}
      bookmarkLabel={text('Bookmark Label', bookmarkLabel)}
      bookmarkedLabel={text('Bookmarked Label', bookmarkedLabel)}
      onRepost={() => action('Repost Clicked')('Synthetic Event')}
      onEntryShare={() => action('Share entry Clicked')('Synthetic Event')}
      onEntryFlag={() => action('Flag Entry Clicked')('Synthetic Event')}
      onClickReplies={() => action('Replies Clicked')('Synthetic Event')}
      onEntryBookmark={() => action('Bookmark Clicked')('Synthetic Event')}
      entryData={object('Entry Data', entryData)}
      sharePostLabel={text('Share Data Title', 'Share Post')}
      shareTextLabel={text('Share Data Text', 'Share this post with your friends')}
      sharePostUrl={'https://ethereum.world'}
      isBookmarked={false}
      repliesLabel={text('Replies Label', repliesLabel)}
      repostsLabel={text('Reposts Label', repostsLabel)}
      repostLabel={text('Repost Label', 'Repost')}
      repostWithCommentLabel={text('Repost with comment Label', 'Repost with comment')}
      onClickAvatar={() => action('Avatar Clicked')('Synthetic Event')}
      shareLabel={text('Share Label', shareLabel)}
      copyLinkLabel={text('Copy link Label', copyLinkLabel)}
      handleFollowAuthor={() => action('Following Box Clicked')('Synthetic Event')}
      handleUnfollowAuthor={() => action('Following Box Clicked')('Synthetic Event')}
      isFollowingAuthor={boolean('Is following author', false)}
      locale={select('Locale', { en: 'en', ro: 'ro', es: 'es' }, 'en')}
      loggedProfileAvatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      loggedProfileEthAddress={text(
        'Logged Profile EthAddress',
        '0x003410499401674320006570047391024572000',
      )}
      onMentionClick={ethAddress => action('Mention Clicked')(ethAddress)}
    />
  </Box>
));
