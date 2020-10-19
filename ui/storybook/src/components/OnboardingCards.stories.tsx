/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { trendingTagsData, trendingProfilesData } from './cards-data';

const { Box, TagCard, TagDetailCard, CustomizeFeedCard, ViewportSizeProvider } = DS;

storiesOf('Cards/Onboarding Cards', module)
  .add('customize feed card', () => (
    <Box align="center" pad={{ top: '40px' }} height="600px">
      <ViewportSizeProvider>
        <CustomizeFeedCard
          profiles={trendingProfilesData}
          tags={trendingTagsData}
          handleFollow={ethAddress => action('Follow')(ethAddress)}
          handleUnfollow={ethAddress => action('Unfollow')(ethAddress)}
          handleSubscribe={tagName => action('Subscribe')(tagName)}
          handleUnsubscribe={tagName => action('Unsubscribe from tag')(tagName)}
          handleCreateFeed={() => action('Create feed')('Synthetic Event')}
        />
      </ViewportSizeProvider>
    </Box>
  ))
  .add('tag card', () => (
    <Box align="center" pad={{ top: '40px' }}>
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
    <Box align="center" pad={{ top: '40px' }}>
      <ViewportSizeProvider>
        <TagDetailCard
          tag={trendingTagsData[0]}
          handleSubscribe={tagName => action('Subscribe to tag')(tagName)}
          handleUnsubscribe={tagName => action('Unsubscribe from tag')(tagName)}
        />
      </ViewportSizeProvider>
    </Box>
  ));
