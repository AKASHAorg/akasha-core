/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { color, object, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import TextIcon from './index';
import { IconType } from '../Icon/index';

const iconTypeOptions: { Home: IconType; HotTopics: IconType; Media: IconType } = {
  Home: 'home',
  HotTopics: 'hotTopics',
  Media: 'media',
};

const iconTypeDefaultValue = 'home';

storiesOf('TextIcon', module).add('default', () => (
  <Box pad="large" align="center">
    <TextIcon
      onClick={() => action('TextIcon Clicked')('Synthetic Event')}
      backgroundColor={color('Background Color', '')}
      color={color('Color', '#132540')}
      iconType={select('Type', iconTypeOptions, iconTypeDefaultValue)}
      text={text('Text', 'Home')}
      spacing={text('Spacing', '10px')}
      margin={object('Margin', { margin: '0px' })}
    />
  </Box>
));
