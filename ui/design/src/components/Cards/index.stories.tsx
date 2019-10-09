/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { array, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import WidgetCard from './widget-card';
import ProfileCard from './profile-card';
import { IconType } from '../Icon/index';

const iconTypeOptions: { TrendingApps: IconType; HotTopics: IconType } = {
  TrendingApps: 'trendingApps',
  HotTopics: 'hotTopics',
};
const iconTypeDefaultValue = 'hotTopics';
const dataSource = ['#ethereumworld', '#akashaworld', '#cryptoworld'];

const profileData = {
  avatarImg: 'http://placebeard.it/640/480',
  profileImg: 'goldenrod',
  name: 'Mariana Gomes',
  userName: '@mariana',
  userInfo:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: 15,
  following: 1876,
  apps: 12,
};
const followingTitle = 'Following';
const appsTitle = 'Apps';
const aboutMetitle = 'About Me';

storiesOf('Cards', module)
  .add('widget card', () => (
    <Box pad="none" align="center" height="224px" width="336px">
      <WidgetCard
        onClick={() => action('WidgetCard Clicked')('Synthetic Event')}
        margin={object('Margin', { margin: '0px' })}
        iconType={select('Type', iconTypeOptions, iconTypeDefaultValue)}
        title={text('Text', 'Hot Topics')}
        titleColor={color('Color', '#132540')}
        dataSource={array('Data source', dataSource)}
      />
    </Box>
  ))
  .add('profile card', () => (
    <Box pad="none" align="center" height="361px" width="581px">
      <ProfileCard
        onClick={() => action('WidgetCard Clicked')('Synthetic Event')}
        margin={object('Margin', { margin: '0px' })}
        profileData={object('Profile Data', profileData)}
        aboutMeTitle={aboutMetitle}
        followingTitle={followingTitle}
        appsTitle={appsTitle}
      />
    </Box>
  ));
