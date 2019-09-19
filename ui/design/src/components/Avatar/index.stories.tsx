/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, object, color } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Avatar from './index';
import { AvatarSize } from './styled-avatar';

storiesOf('Avatar', module)
  .add('minimal', () => (
    <Avatar
      src="https://placebeard.it/360x360"
      roundedCorners={boolean('Rounded corners', false)}
    />
  ))
  .add('margin and background color', () => (
    <Avatar
      src="https://placebeard.it/360x360"
      roundedCorners={boolean('Rounded corners', false)}
      margin={object('Margin', { margin: '0px' })}
      backgroundColor={color('Background Color', '')}
    />
  ))
  .add('with click handler', () => (
    <Avatar
      src="https://placebeard.it/360x360"
      size="md"
      roundedCorners={boolean('Rounded corners', false)}
      onClick={ev => action('Avatar Clicked!')(ev.type)}
    />
  ))
  .add('size: (default sm)', () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: '50%',
      }}
    >
      {[
        { size: 'xs', value: 24 },
        { size: 'sm', value: 32 },
        { size: 'md', value: 40 },
        { size: 'lg', value: 48 },
      ].map(({ size, value }) => (
        <div>
          {size} ({value} px)
          <Avatar
            key={size}
            size={size as AvatarSize}
            src="https://placebeard.it/360x360"
            roundedCorners={boolean('Rounded corners', false)}
          />
        </div>
      ))}
    </div>
  ));
