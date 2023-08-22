import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip, { TooltipProps } from '@akashaorg/design-system-core/lib/components/Tooltip';

const meta: Meta<TooltipProps> = {
  title: 'DSCore/Tooltip/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<TooltipProps>;

const variants: TooltipProps[] = [
  {
    content: 'Left-placed tooltip',
    placement: 'left',
  },
  {
    content: 'Right-placed tooltip',
    placement: 'right',
  },
  {
    content: 'Top-placed tooltip',
    placement: 'top',
  },
  {
    content: 'Bottom-placed tooltip',
    placement: 'bottom',
  },
];

const childrenNode = <Text color="white">Hover to learn more</Text>;

const ControlledTooltipComponent = () => {
  const [showToolTip, setShowTooltip] = useState(false);

  return (
    <Box customStyle={'flex justify-center items-center h-screen'}>
      <Tooltip
        content="I am a tooltip"
        placement="bottom"
        open={showToolTip}
        onOpen={() => setShowTooltip(true)}
        onClose={() => setShowTooltip(false)}
      >
        {childrenNode}
      </Tooltip>
    </Box>
  );
};

export const TooltipVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-8" customStyle="w-[25%] my-0 mx-auto">
      {variants.map((variant, idx) => (
        <Tooltip key={idx} {...variant}>
          {childrenNode}
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const ControlledTooltip: Story = {
  render: () => <ControlledTooltipComponent />,
};

export const CenterArrowToReferenceTooltip: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      <Tooltip
        content={
          <Text color="white">
            I am a tooltip
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content ...
            <br />
            more content
          </Text>
        }
        arrow={false}
        placement="left"
        centerArrowToReference={true}
      >
        {childrenNode}
      </Tooltip>
    </div>
  ),
};
