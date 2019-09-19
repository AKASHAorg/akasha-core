/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Icon from './';

const types = [
  'activity',
  'akasha',
  'akashaWelcome',
  'arrowDown',
  'arrowDropdownClose',
  'arrowDropdownOpen',
  'arrowLeft',
  'arrowRight',
  'arrowsUpDown',
  'arrowUp',
  'back',
  'bold',
  'bookmark',
  'chat',
  'check',
  'close',
  'closeEntryOption',
  'comment',
  'commentLarge',
  'community',
  'dashboard',
  'discord',
  'draft',
  'edit',
  // 'emojiHug',
  'entries',
  'entry',
  'essence',
  'facebook',
  'followers',
  'following',
  'forward',
  'geth',
  'gethGreen',
  'gethOrange',
  'gethRed',
  'github',
  'heart',
  'highlight',
  // 'importIcon',
  'ipfs',
  'ipfsGreen',
  'ipfsOrange',
  'ipfsRed',
  'italic',
  'karma',
  'link',
  'linkEntry',
  'lists',
  'lock',
  'mana',
  'mediaEntry',
  'menu',
  'more',
  'newEntry',
  'notifications',
  'notificationsOn',
  'openEntryOptions',
  'photoImage',
  'plus',
  'profileOverview',
  'question',
  'questionCircle',
  'quote',
  'reddit',
  'refresh',
  'reload',
  'reply',
  'search',
  'settings',
  'share',
  'shareLarge',
  'stats',
  'tag',
  'textEntry',
  'timer',
  'trash',
  'twitter',
  'underline',
  'user',
  'video',
  'wallet',
  'zipFile',
];

const IconComponent = () => {
  const accentColor = color('Accent color', '#fff');
  const backgroundColor = color('Background color', '#6d1366');
  return (
    <>
      {types.map((type, idx) => (
        <div key={idx}>
          <div
            style={{
              backgroundColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '40px',
            }}
          >
            <Icon type={type} color={accentColor} onClick={action('onClick')} />
          </div>
          <div>{type}</div>
        </div>
      ))}
    </>
  );
};

storiesOf('Icon', module).add('default', () => <IconComponent />);
