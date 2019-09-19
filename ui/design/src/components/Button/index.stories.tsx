/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, text, select, object, color } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Box } from 'grommet';
import Button from './index';

storiesOf('Button', module).add('default', () => (
  <Box pad="large" align="center">
    <Button
      buttonType={select(
        'Type',
        {
          Primary: 'primary',
          Regular: 'regular',
          Alert: 'alert',
        },
        'primary',
      )}
      ghost={boolean('Ghost', false)}
      disabled={boolean('Disabled', false)}
      small={boolean('Small', false)}
      fullWidth={boolean('Full width', false)}
      onClick={() => action('Button Clicked')('Synthetic Event')}
      margin={object('Margin', { margin: '0px' })}
      backgroundColor={color('Background Color', '')}
    >
      {text('Children', 'Click Me!')}
    </Button>
  </Box>
));
