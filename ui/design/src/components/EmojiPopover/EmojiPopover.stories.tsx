import React from 'react';
import { Box, Grommet } from 'grommet';

import EmojiPopover, { IEmojiPopover } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Popovers/EmojiPopover',
  component: EmojiPopover,
  argTypes: {
    onClickEmoji: { action: 'clicked emoji' },
  },
};

const Template = (args: IEmojiPopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="eye" onClick={() => setEmojiOpen(true)} />
          </div>
          {iconRef.current && emojiOpen && (
            <EmojiPopover
              {...args}
              target={iconRef.current}
              closePopover={() => setEmojiOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseEmojiPopover = Template.bind({});
