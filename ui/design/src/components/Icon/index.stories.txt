/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { color } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import { Icon, iconTypes } from './index';

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

storiesOf('Icon', module).add('default', () => <IconComponent />);
