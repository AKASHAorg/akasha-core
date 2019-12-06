/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { AvatarSize } from '@akashaproject/design-system/lib/components/Avatar/styled-avatar';
import { action } from '@storybook/addon-actions';
import { boolean, color, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Avatar, EditableAvatar } = DS;
const DEFAULT_AVATAR_SIZE = 'md';
const seed = '0x00000000000000';
storiesOf('Avatar', module)
  .add('minimal', () => <Avatar seed={seed} src="https://placebeard.it/360x360" />)
  .add('margin and background color', () => (
    <Avatar
      seed={seed}
      src="https://placebeard.it/360x360"
      margin={object('Margin', { margin: '0px' })}
      backgroundColor={color('Background Color', '')}
      withBorder={boolean('withBorder', true)}
    />
  ))
  .add('with click handler', () => (
    <Avatar
      seed={seed}
      src="https://placebeard.it/360x360"
      size="md"
      /* tslint:disable-next-line:jsx-no-lambda */
      onClick={(ev: any) => action('Avatar Clicked!')(ev.type)}
      withBorder={boolean('withBorder', true)}
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
        { size: 'xl', value: 84 },
      ].map(({ size, value }, index) => (
        <div key={index}>
          {size} ({value} px)
          <Avatar
            seed={seed}
            key={size}
            size={size as AvatarSize}
            src="https://placebeard.it/360x480"
            withBorder={boolean('withBorder', true)}
          />
        </div>
      ))}
    </div>
  ))
  .add('Guest mode', () => {
    return <Avatar seed={seed} guest={true} size="xl" withBorder={boolean('withBorder', true)} />;
  })
  .add('Avatar not set', () => {
    return (
      <Avatar
        withBorder={boolean('withBorder', true)}
        size="xl"
        seed={text('eth address', '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8')}
      />
    );
  })
  .add('Editable avatar', () => {
    return (
      <EditableAvatar
        withBorder={boolean('withBorder', true)}
        size="xl"
        seed={text('eth address', '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8')}
        onChange={
          // tslint:disable-next-line:jsx-no-lambda
          () => {
            action('Change avatar')('Avatar changed');
          }
        }
      />
    );
  });
