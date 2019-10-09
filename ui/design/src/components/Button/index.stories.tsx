/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import AkashaButton from './index';
import Icon from '../Icon/index';

storiesOf('Button', module)
  .add('share profile', () => (
    <Box pad="large" align="center">
      <AkashaButton
        primary
        hoverIndicator="false"
        disabled={boolean('Disabled', false)}
        onClick={() => action('AkashaButton Clicked')('Synthetic Event')}
        margin={object('Margin', { bottom: '0px' })}
        color={'#000C20'}
        icon={<Icon type="home" />}
        label={text('Label', 'Share Profile')}
      />
    </Box>
  ))
  .add('thumbs up', () => (
    <Box pad="large" align="center">
      <AkashaButton
        primary
        hoverIndicator="false"
        disabled={boolean('Disabled', false)}
        onClick={() => action('AkashaButton Clicked')('Synthetic Event')}
        margin={object('Margin', { bottom: '0px' })}
        color={'#EDF0F5'}
        icon={<Icon type="wallet" />}
        reverse
        label={text('Label', '26')}
      />
    </Box>
  ));
