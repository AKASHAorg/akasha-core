/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import * as React from 'react';
import { CHARACTERS, TAGS } from './editor-data';

const { EditorBox, Box, EditorMeter } = DS;

const EditorComponent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <EditorBox
      onPublish={() => action('Clicked on')('Synthetic Event')}
      avatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572000')}
      setLetterCount={setCount}
      withMeter={<EditorMeter counter={count} />}
      mentions={CHARACTERS}
      tags={TAGS}
    />
  );
};

storiesOf('Editor/Desktop', module).add('default', () => (
  <Box fill={true} align="center" justify="center">
    <Box
      width="35rem"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'all',
      }}
    >
      {EditorComponent()}
    </Box>
  </Box>
));
