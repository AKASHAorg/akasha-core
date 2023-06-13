import React, { useState } from 'react';
import { tw, apply } from '@twind/core';

import Tooltip, { TooltipProps } from './index';

export default {
  title: 'Tooltip/Tooltip',
  component: Tooltip,
};

const Template = (args: TooltipProps) => (
  <div className={tw(apply('flex justify-center items-center h-screen'))}>
    <Tooltip {...args} />
  </div>
);

export const LeftArrowTooltip = Template.bind({});
LeftArrowTooltip.args = {
  content: 'I am a tooltip',
  placement: 'left',
  children: <>Hover over me to know more</>,
};

export const RightArrowTooltip = Template.bind({});
RightArrowTooltip.args = {
  content: 'I am a tooltip',
  placement: 'right',
  children: <>Hover over me to know more</>,
};

export const TopArrowTooltip = Template.bind({});
TopArrowTooltip.args = {
  content: 'I am a tooltip',
  placement: 'top',
  children: <>Hover over me to know more</>,
};

export const BottomArrowTooltip = Template.bind({});
BottomArrowTooltip.args = {
  content: 'I am a tooltip',
  placement: 'bottom',
  children: <>Hover over me to know more</>,
};

const CenterArrowToReferenceTemplate = (args: TooltipProps) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
    }}
  >
    <Tooltip {...args} />{' '}
  </div>
);

export const CenterArrowToReferenceTooltip = CenterArrowToReferenceTemplate.bind({});
CenterArrowToReferenceTooltip.args = {
  content: (
    <>
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
    </>
  ),
  arrow: false,
  placement: 'left',
  centerArrowToReference: true,
  children: <>Hover over me to know more ...</>,
};

const ControlledTemplate = (args: TooltipProps) => {
  const [showToolTip, setShowTooltip] = useState(false);
  return (
    <div className={tw(apply('flex justify-center items-center h-screen'))}>
      <Tooltip
        {...args}
        open={showToolTip}
        onOpen={() => setShowTooltip(true)}
        onClose={() => setShowTooltip(false)}
      />
    </div>
  );
};

export const ControlledTooltip = ControlledTemplate.bind({});
ControlledTooltip.args = {
  content: 'I am a tooltip',
  placement: 'bottom',
  children: <>Hover over me to know more</>,
};

export const ClickModeTooltip = Template.bind({});
ClickModeTooltip.args = {
  content: 'I am a tooltip',
  placement: 'bottom',
  trigger: 'click',
  children: <>Hover over me to know more</>,
};
