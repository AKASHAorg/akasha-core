/* eslint-disable import/first */
import { Avatar } from '@akashaproject/design-system';
import { AvatarSize } from '@akashaproject/design-system/lib/components/Avatar/styled-avatar';
import { action } from '@storybook/addon-actions';
import { boolean, color, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

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
      /* tslint:disable-next-line:jsx-no-lambda */
      onClick={(ev: any) => action('Avatar Clicked!')(ev.type)}
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
        { size: 'xl', value: 72 },
      ].map(({ size, value }, index) => (
        <div key={index}>
          {size} ({value} px)
          <Avatar key={size} size={size as AvatarSize} src="https://placebeard.it/360x480" />
        </div>
      ))}
    </div>
  ))
  .add('Guest mode', () => {
    return <Avatar withBorder={false} guest={true} size="xl" />;
  })
  .add('Avatar not set', () => {
    return (
      <Avatar size="xl" seed={text('eth address', '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8')} />
    );
  });
