/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { trendingTagsData } from './cards-data';

const { Box, TagCard, TagDetailCard, TagProfileCard, ViewportSizeProvider } = DS;

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
      <ViewportSizeProvider>
        <TagProfileCard
          tag={trendingTagsData[0]}
          subscribedTags={['Ethereum']}
          handleSubscribeTag={tagName => action('Subscribe to tag')(tagName)}
          handleUnsubscribeTag={tagName => action('Unsubscribe from tag')(tagName)}
        />
      </ViewportSizeProvider>
    </Box>
  ));
