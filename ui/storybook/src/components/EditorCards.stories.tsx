/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, EditorCard } = DS;

storiesOf('Cards/Editor Cards', module).add('editor card', () => (
  <Box align="center" pad={{ top: '40px' }}>
    <EditorCard
      avatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572000')}
      onPublish={action('Publish clicked')}
      handleNavigateBack={action('Navigate back')}
    />
  </Box>
));
