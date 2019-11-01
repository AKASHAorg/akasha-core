/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from '@akashaproject/design-system';
import * as React from 'react';
import { IconType } from '@akashaproject/design-system/lib/components/Icon/icon';
import { TextIcon } from '@akashaproject/design-system';

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
      label={text('Label', 'Home')}
      spacing={text('Spacing', '10px')}
      margin={object('Margin', { margin: '0px' })}
      clickable={boolean('Clickable', false)}
    />
  </Box>
));
