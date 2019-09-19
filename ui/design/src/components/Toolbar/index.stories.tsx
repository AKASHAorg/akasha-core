/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { CheckboxSelected, Performance, Phone, PieChart, Pin, Play, Search } from 'grommet-icons';
import * as React from 'react';
import ToolBar from './index';

const ToolBarComponent = () => {
  return (
    <ToolBar
      avatar={boolean('avatar', true)}
      topIconsDisable={boolean('topIconsDisable', false)}
      bottomIconsDisable={boolean('bottomIconsDisable', false)}
      mainIcon={
        <CheckboxSelected
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />
      }
      topIcons={[
        <Play
          key="play-icon"
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />,
        <Phone
          key="phone-icon"
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />,
        <PieChart
          key="pie-icon"
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />,
      ]}
      bottomIcons={[
        <Performance
          key="performance-icon"
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />,
        <Pin
          key="pin-icon"
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />,
      ]}
      avatarIcon={
        <Search
          color="dark-3"
          onClick={() => action('Icon click')('Synthetic Event')}
          onBlur={() => action('onBlur')('Synthetic Event')}
        />
      }
      sidebarContentMap={[
        {
          title: 'My profile',
          links: ['My entries', 'Highlights', 'Lists', 'User settings', 'App preferences'],
        },
        {
          title: 'My profile',
          links: ['My entries', 'Highlights', 'Lists'],
        },
        {
          title: 'My profile',
          links: ['My entries', 'Highlights'],
        },
      ]}
    />
  );
};

storiesOf('ToolBar', module).add('ToolBar', () => <ToolBarComponent />);
