/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { action } from '@storybook/addon-actions';
import { boolean, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import {
  aboutMeLabel,
  actionsLabel,
  appData,
  appInfo,
  appsDataSource,
  appsLabel,
  boxProviderData,
  cancelLabel,
  changeCoverImageLabel,
  copyLinkLabel,
  editProfileLabel,
  ensProviderData,
  entryData,
  followingLabel,
  placeholderLabel,
  profileData,
  profileProvidersData,
  publishLabel,
  saveChangesLabel,
  shareLabel,
  shareProfileLabel,
  topicsDataSource,
  usersLabel,
  copyIPFSLinkLabel,
  flagAsLabel,
  bookmarkLabel,
  bookmarkedLabel,
  repliesLabel,
  repostsLabel,
} from './cards-data';

const {
  AppInfoWidgetCard,
  AppsWidgetCard,
  Box,
  EditorCard,
  EntryCard,
  BoxFormCard,
  EnsFormCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileWidgetCard,
  TopicsWidgetCard,
} = DS;

storiesOf('Cards|Widget Cards', module)
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

storiesOf('Cards|Editor Cards', module).add('editor card', () => (
  <Box align="center" pad={{ top: '40px' }}>
    <EditorCard
      avatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572000')}
      publishLabel={text('Publish Label', publishLabel)}
      placeholderLabel={text('PlaceholderLabel', placeholderLabel)}
      onPublish={action('Publish clicked')}
    />
  </Box>
));

storiesOf('Cards|Profile Cards', module)
  .add('profile card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <ProfileCard
        onClickApps={() => action('Apps Box Clicked')('Synthetic Event')}
        onClickFollowing={() => action('Following Box Clicked')('Synthetic Event')}
        onChangeProfileData={(newProfileData: IProfileData) =>
          action('ProfileData Changed')(newProfileData)
        }
        // @ts-ignore
        profileData={select('Profile Data', { dapp: appData, user: profileData }, profileData)}
        descriptionLabel={text('About me', aboutMeLabel)}
        actionsLabel={text('Actions', actionsLabel)}
        followingLabel={text('Following', followingLabel)}
        appsLabel={text('Apps', appsLabel)}
        usersLabel={text('Users', usersLabel)}
        shareProfileLabel={text('Share Profile', shareProfileLabel)}
        // edit profile related
        editProfileLabel={text('Edit Profile', editProfileLabel)}
        profileProvidersData={profileProvidersData}
        changeCoverImageLabel={text('Change Cover Image', changeCoverImageLabel)}
        cancelLabel={text('Cancel Edit', cancelLabel)}
        saveChangesLabel={text('Save Edit', saveChangesLabel)}
        getProfileProvidersData={() => action('Gettting full Profile Data')('Synthetic Event')}
      />
    </Box>
  ))
  .add('profile widget card', () => (
    <Box pad="none" align="center" width="336px">
      <ProfileWidgetCard
        onClickApps={() => action('Apps Box Clicked')('Synthetic Event')}
        onClickFollowing={() => action('Following Box Clicked')('Synthetic Event')}
        // @ts-ignore
        profileData={select('Profile Data', { dapp: appData, user: profileData }, profileData)}
        descriptionLabel={text('About me', aboutMeLabel)}
        actionsLabel={text('Actions', actionsLabel)}
        followingLabel={text('Following', followingLabel)}
        appsLabel={text('Apps', appsLabel)}
        usersLabel={text('Users', usersLabel)}
        shareProfileLabel={text('Share Profile', shareProfileLabel)}
      />
    </Box>
  ));

storiesOf('Cards|Entry Cards', module).add('entry card', () => (
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
      onLinkCopy={() => action('Link Copied')('Synthetic Event')}
      onEntryBookmark={() => action('Bookmark Clicked')('Synthetic Event')}
      entryData={object('Entry Data', entryData)}
      isBookmarked={false}
      repliesLabel={text('Replies Label', repliesLabel)}
      repostsLabel={text('Reposts Label', repostsLabel)}
      onClickAvatar={() => action('Avatar Clicked')('Synthetic Event')}
      shareLabel={text('Share Label', shareLabel)}
      copyLinkLabel={text('Copy link Label', copyLinkLabel)}
      locale={select('Locale', { en: 'en', ro: 'ro', es: 'es' }, 'en')}
      loggedProfileAvatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      loggedProfileEthAddress={text(
        'Logged Profile EthAddress',
        '0x003410499401674320006570047391024572000',
      )}
    />
  </Box>
));

storiesOf('Cards|Form Cards', module)
  .add('3Box form card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <BoxFormCard
        uploadLabel={text('upload Label', 'Upload an image')}
        urlLabel={text('url Label', 'By url')}
        deleteLabel={text('delete Label', 'Delete Image')}
        titleLabel={text('Title Label', 'Ethereum Address')}
        avatarLabel={text('Avatar Label', 'Avatar')}
        coverImageLabel={text('Cover Image Label', 'Cover Image')}
        nameLabel={text('Name Label', 'Name')}
        descriptionLabel={text('Description Label', 'Description')}
        cancelLabel={text('Cancel Label', 'Cancel')}
        saveLabel={text('Save Label', 'Save')}
        nameFieldPlaceholder={text('Name placeholder', 'Type your name here')}
        descriptionFieldPlaceholder={text(
          'Description placeholder',
          'Add a description about you here',
        )}
        ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572456')}
        providerData={object('Provider Data', boxProviderData)}
        handleSubmit={() => action('Form submitted')('Synthetic Event')}
      />
    </Box>
  ))
  .add('ENS form card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <EnsFormCard
        titleLabel={text('Title Label', 'Ethereum Address')}
        secondaryTitleLabel={text('Secondary Title Label', 'Ethereum Name')}
        nameLabel={text('Name Label', 'Add an ethereum name to your address')}
        errorLabel={text(
          'Error Label',
          'Sorry, this name is unavailable. Please choose another one.',
        )}
        cancelLabel={text('Cancel Label', 'Cancel')}
        saveLabel={text('Save Label', 'Save')}
        nameFieldPlaceholder={text('Name placeholder', 'yourname')}
        ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572456')}
        providerData={object('Provider Data', ensProviderData)}
        handleSubmit={() => action('Form submitted')('Synthetic Event')}
        validateEns={() => action('validating ens')('Synthetic Event')}
        validEns={boolean('valid ens', true)}
      />
    </Box>
  ));
