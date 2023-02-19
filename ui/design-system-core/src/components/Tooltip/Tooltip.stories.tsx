import React from 'react';

import Tooltip, { TooltipProps } from './index';

export default {
  title: 'Tooltip/Tooltip',
  component: Tooltip,
};

const Template = (args: TooltipProps) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Tooltip {...args} />
  </div>
);

export const LeftArrowTooltip = Template.bind({});
LeftArrowTooltip.args = {
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
    </>
  ),
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
  placement: 'left',
  centerArrowToReference: true,
  children: <>Hover over me to know more ...</>,
};
