/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { color, object, text, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import {
  appInfo,
  trendingTagsData,
  trendingProfilesData,
  appsDataSource,
  topicsDataSource,
} from './cards-data';

const {
  Box,
  AppsWidgetCard,
  TopicsWidgetCard,
  AppInfoWidgetCard,
  SourcesWidgetCard,
  MiniInfoWidgetCard,
  TrendingWidgetCard,
  TutorialWidgetCard,
} = DS;

storiesOf('Cards/Widget Cards', module)
  .add('topics widget card', () => (
    <Box pad="none" align="center">
      <TopicsWidgetCard
        onClick={() => action('TopicsWidgetCard Clicked')('Synthetic Event')}
        onTopicClick={topicData => action('Topic Clicked')(topicData)}
        margin={object('Margin', { margin: '0px' })}
        iconType={'hotTopics'}
        label={text('Text', 'Hot Topics')}
        labelColor={color('Color', '#132540')}
        dataSource={topicsDataSource}
      />
    </Box>
  ))
  .add('apps widget card', () => (
    <Box pad="none" align="center">
      <AppsWidgetCard
        onClick={() => action('AppsWidgetCard Clicked')('Synthetic Event')}
        onAppClick={dappData => action('App Clicked')(dappData)}
        margin={object('Margin', { margin: '0px' })}
        iconType={'trendingApps'}
        label={text('Text', 'Trending Apps')}
        labelColor={color('Color', '#132540')}
        dataSource={appsDataSource}
      />
    </Box>
  ))
  .add('tutorial widget card', () => (
    <Box pad="none" align="center">
      <TutorialWidgetCard
        currentProgress={number('Current progress', 0)}
        titleLabel={text('Title label', 'Pick your ethereum name')}
        subtitleLabel={text('Subtitle label', 'Take your address to the next level')}
        infoLabel={text(
          'Text',
          'Your human-friendly Ethereum name can be used also in wallets instead of your address',
        )}
        subtitleIcon={text('Subtitle icon', 'iconEns')}
        seeVideoTutorialLabel={text('See video label', 'See video tutorial')}
        callToActionLabel={text('Call to action label', 'Go to app')}
        learnMoreLabel={text('Learn more label', 'Learn more')}
        handleSeeVideoTutorial={() => action('see video tutorial clicked')('Synthetic Event')}
        handleDismiss={() => action('Dismiss Clicked')('Synthetic Event')}
      />
    </Box>
  ))
  .add('sources widget card', () => (
    <Box pad="none" align="center">
      <SourcesWidgetCard
        titleLabel={text('Title label', 'My feed sources')}
        tagsNumber={number('Tags number', 15)}
        profilesNumber={number('Profiles number', 35)}
        appsNumber={number('Total number', 50)}
      />
    </Box>
  ))
  .add('trending widget card', () => (
    <Box pad="none" align="center">
      <TrendingWidgetCard
        titleLabel={text('Title', 'Trending Right Now')}
        topicsLabel={text('Topics label', 'Topics')}
        profilesLabel={text('Profiles label', 'Profiles')}
        showMoreLabel={text('Show more label', 'Show More')}
        onClickProfile={ethAddress => action('profile Clicked')(ethAddress)}
        onClickTag={tagName => action('tag clicked')(tagName)}
        onClickSubscribeProfile={ethAddress => action('subscribe profile clicked')(ethAddress)}
        onClickSubscribeTag={tagName => action('subscribe tag clicked')(tagName)}
        onClickMoreTags={() => action('Show more Clicked')('Synthetic Event')}
        onClickMoreProfiles={() => action('Show more Clicked')('Synthetic Event')}
        tags={trendingTagsData}
        profiles={trendingProfilesData}
      />
    </Box>
  ))
  .add('app info widget card', () => (
    <Box pad="none" align="center">
      <AppInfoWidgetCard
        appInfo={appInfo}
        versionLabel={text('Version', 'Version')}
        statusLabel={text('Status', 'Status')}
        lastUpdateLabel={text('Las Updated', 'last updated')}
        submittedLabel={text('Submitted', 'submitted')}
        adminLabel={text('Admin', 'admin')}
        categoryLabel={text('Category', 'category')}
        receiveUpdatesLabel={text('Receive Updates', 'Receive updates from')}
        subscribeLabel={text('Subscribe', 'subscribe')}
        unsubscribeLabel={text('Unsubscribe', 'unsubscribe')}
        reportLabel={text('Report', 'Flag as inappropriate')}
        handleSubscribe={() => action('handle Subscribe Clicked')('Synthetic Event')}
        handleReport={() => action('handle Report Clicked')('Synthetic Event')}
      />
    </Box>
  ))
  .add('mini info widget card', () => (
    <Box pad="none" align="center">
      <MiniInfoWidgetCard
        titleLabel={text('Title', 'Example title')}
        subtitleLabel={text(
          'Subtitle',
          'Description of a call to action. Something to prompt the user to click',
        )}
        learnMoreLabel={text('Learn More', 'learn more')}
        callToActionLabel={text('CTA', 'Do something')}
        handleLearnMore={() => action('handle learn more Clicked')('Synthetic Event')}
        handleCallToAction={() => action('handle call to action Clicked')('Synthetic Event')}
        handleDismiss={() => action('handle dismiss Clicked')('Synthetic Event')}
      />
    </Box>
  ));
