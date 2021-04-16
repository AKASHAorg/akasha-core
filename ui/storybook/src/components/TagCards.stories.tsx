/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { trendingTagsData } from './cards-data';

const { Box, TagCard, TagDetailCard, TagProfileCard, TagSearchCard, ViewportSizeProvider } = DS;

storiesOf('Cards/Tag Cards', module)
  .add('tag card', () => (
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <ViewportSizeProvider>
        <TagCard
          tag={trendingTagsData[0]}
          handleSubscribe={tagName => action('Subscribe to tag')(tagName)}
          handleUnsubscribe={tagName => action('Unsubscribe from tag')(tagName)}
        />
      </ViewportSizeProvider>
    </Box>
  ))
  .add('tag detail card', () => (
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <ViewportSizeProvider>
        <TagDetailCard
          tag={trendingTagsData[0]}
          handleSubscribe={tagName => action('Subscribe to tag')(tagName)}
          handleUnsubscribe={tagName => action('Unsubscribe from tag')(tagName)}
        />
      </ViewportSizeProvider>
    </Box>
  ))
  .add('tag profile card', () => (
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <TagProfileCard
        tag={trendingTagsData[0]}
        subscribedTags={['Ethereum']}
        handleSubscribeTag={tagName => action('Subscribe to tag')(tagName)}
        handleUnsubscribeTag={tagName => action('Unsubscribe from tag')(tagName)}
      />
    </Box>
  ))
  .add('tag search card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <TagSearchCard
        tag={trendingTagsData[0]}
        subscribedTags={['Ethereum']}
        mentionsLabel={text('Mentions Label', 'posts')}
        subscribeLabel={text('Subscribe Label', 'Subscribe')}
        subscribedLabel={text('Subscribed Label', 'Subscribed')}
        unsubscribeLabel={text('Unsubscribe Label', 'Unsubscribe')}
        tagAnchorLink={text('Tag Anchor Link', '/social-app/tags')}
        handleSubscribeTag={tagName => action('Subscribe to tag')(tagName)}
        handleUnsubscribeTag={tagName => action('Unsubscribe from tag')(tagName)}
      />
    </Box>
  ));
