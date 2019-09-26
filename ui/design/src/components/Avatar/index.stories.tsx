/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import spacing from '../../styles/spacing';
import Avatar from './index';
import { AvatarSize } from './styled-avatar';

const DEFAULT_AVATAR_SIZE = 'md';

storiesOf('Avatar', module)
  .add('minimal', () => <Avatar src="https://placebeard.it/360x360" />)
  .add('margin and background color', () => (
    <Avatar
      src="https://placebeard.it/360x360"
      margin={object('Margin', { margin: '0px' })}
      backgroundColor={color('Background Color', '')}
    />
  ))
  .add('with click handler', () => (
    <Avatar
      src="https://placebeard.it/360x360"
      size="md"
      onClick={ev => action('Avatar Clicked!')(ev.type)}
    />
  ))
  .add(`size: (default ${DEFAULT_AVATAR_SIZE})`, () => (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxWidth: '50%',
        }}
      >
        {Object.keys(spacing.components.avatar.sizes).map(size => (
          <div key={size}>
            {size} ({spacing.components.avatar.sizes[size]}){' '}
            {size === DEFAULT_AVATAR_SIZE && <b>default</b>}
            <Avatar
              key={size}
              size={size as AvatarSize}
              margin={object(`Margin for ${size}`, { margin: '0px' })}
              backgroundColor={color(`Background Color for ${size}`, '')}
              src="https://placebeard.it/360x460"
              withBorder={true}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>md (default): used on cards, widgets, comments, etc.</div>
        <div>lg: used on profile page</div>
      </div>
    </div>
  ));
