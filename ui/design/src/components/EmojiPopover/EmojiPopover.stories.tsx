import React from 'react';
import { Box, Grommet } from 'grommet';
import { withDesign } from 'storybook-addon-designs';
import EmojiPopover, { IEmojiPopover } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Popovers/EmojiPopover',
  component: EmojiPopover,
  argTypes: {
    onClickEmoji: { action: 'clicked emoji' },
  },
  decorators: [withDesign],
};

const Template = (args: IEmojiPopover) => {
  const iconRef = React.useRef<HTMLDivElement>(null);
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
BaseEmojiPopover.args = {
  emojiPlaceholderLabel: 'Search',
};

BaseEmojiPopover.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=256%3A6871',
  },
};
