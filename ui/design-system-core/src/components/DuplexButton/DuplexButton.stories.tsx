import React from 'react';

import DuplexButton from './';

export default {
  title: 'DuplexButton',
  component: DuplexButton,
};

const Template = args => {
  const [active, setActive] = React.useState(false);

  const handleClick = () => {
    setActive(!active);
  };
  return (
    <DuplexButton
      {...args}
      active={args.active || active}
      onClickActive={handleClick}
      onClickInactive={handleClick}
    />
  );
};

export const BaseDuplexButton = Template.bind({});
BaseDuplexButton.args = {
  inactiveLabel: 'Follow',
  activeLabel: 'Following',
  activeHoverLabel: 'Unfollow',
  active: false,
  icon: 'RssIcon',
};
