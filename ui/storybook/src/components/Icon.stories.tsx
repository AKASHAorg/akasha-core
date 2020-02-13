/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { color, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, Icon, iconTypes, AppIcon } = DS;

const IconComponent = () => {
  const accentColor = color('Accent color', '');
  const backgroundColor = color('Background color', '#EDF0F5');
  return (
    <>
      {iconTypes.map((type, idx) => (
        <Box direction="row" align="center" key={idx}>
          <div
            style={{
              backgroundColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '40px',
              margin: '2px 0',
            }}
          >
            <Icon type={type} color={accentColor} onClick={() => action('Clicked on')(type)} />
          </div>
          <div>{type}</div>
        </Box>
      ))}
    </>
  );
};

storiesOf('Icon|Icons', module).add('default', () => <IconComponent />);
storiesOf('Icon|AppIcon', module)
  .add('with placeholder', () => (
    <Box align="center">
      <AppIcon placeholderIconType={select('Icons', iconTypes, 'activity')} />
    </Box>
  ))
  .add('with image', () => (
    <Box align="center">
      <AppIcon
        placeholderIconType={select('Icons', iconTypes, 'activity')}
        appImg={'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png'}
      />
    </Box>
  ))
  .add('3 sizes', () => (
    <Box align="center" gap="medium">
      <AppIcon placeholderIconType={select('Icons', iconTypes, 'activity')} size="sm" />
      <AppIcon placeholderIconType={select('Icons', iconTypes, 'activity')} size="md" />
      <AppIcon placeholderIconType={select('Icons', iconTypes, 'activity')} size="lg" />
    </Box>
  ));
