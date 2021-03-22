/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import {
  appData,
  profileData,
  profileProvidersData,
  postsLabel,
  cancelLabel,
  aboutMeLabel,
  followingLabel,
  followersLabel,
  saveChangesLabel,
  editProfileLabel,
  shareProfileLabel,
  changeCoverImageLabel,
} from './cards-data';

const { Box, ProfileCard, ProfileWidgetCard, ProfileMiniCard, ProfileSearchCard } = DS;

storiesOf('Cards/Profile Cards', module)
  .add('profile card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <ProfileCard
        onClickFollowers={() => action('Followers Box Clicked')('Synthetic Event')}
        onClickFollowing={() => action('Following Box Clicked')('Synthetic Event')}
        onClickPosts={() => action('PostsBox Clicked')('Synthetic Event')}
        onChangeProfileData={(newProfileData: IProfileData) =>
          action('ProfileData Changed')(newProfileData)
        }
        handleShareClick={() => action('Share profile Clicked')('Synthetic Event')}
        // @ts-ignore
        profileData={select('Profile Data', { dapp: appData, user: profileData }, profileData)}
        descriptionLabel={text('About me', aboutMeLabel)}
        followingLabel={text('Following', followingLabel)}
        followersLabel={text('Followers', followersLabel)}
        postsLabel={text('Users', postsLabel)}
        shareProfileLabel={text('Share Profile', shareProfileLabel)}
        // edit profile related
        editProfileLabel={text('Edit Profile', editProfileLabel)}
        profileProvidersData={profileProvidersData}
        changeCoverImageLabel={text('Change Cover Image', changeCoverImageLabel)}
        cancelLabel={text('Cancel Edit', cancelLabel)}
        saveChangesLabel={text('Save Edit', saveChangesLabel)}
        flagAsLabel={text('Report Label', 'Report Profile')}
        flaggable={true}
        onEntryFlag={() => null}
        getProfileProvidersData={() => action('Gettting full Profile Data')('Synthetic Event')}
      />
    </Box>
  ))
  .add('profile search card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <ProfileSearchCard
        postsLabel={text('Users', postsLabel)}
        // @ts-ignore
        profileData={select('Profile Data', { dapp: appData, user: profileData }, profileData)}
        handleFollow={() => action('Following Box Clicked')('Synthetic Event')}
        handleUnfollow={() => action('Following Box Clicked')('Synthetic Event')}
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
        followingLabel={text('Following', followingLabel)}
        followersLabel={text('Followers', followersLabel)}
        postsLabel={text('Posts', postsLabel)}
        shareProfileLabel={text('Share Profile', shareProfileLabel)}
      />
    </Box>
  ))
  .add('profile mini card', () => (
    <Box pad="none" align="center" width="500px">
      <ProfileMiniCard
        handleFollow={() => action('Following Box Clicked')('Synthetic Event')}
        handleUnfollow={() => action('Following Box Clicked')('Synthetic Event')}
        // @ts-ignore
        profileData={select('Profile Data', { dapp: appData, user: profileData }, profileData)}
      />
    </Box>
  ));
