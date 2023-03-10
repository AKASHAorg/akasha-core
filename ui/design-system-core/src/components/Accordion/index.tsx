import React from 'react';
import { apply, tw } from '@twind/core';

import Icon from '../Icon';

export interface IAccordionProps {
  style?: string;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
}

const Accordion: React.FC<IAccordionProps> = props => {
  const { style, titleNode, contentNode } = props;

  // internal state for accordion toggle
  const [isToggled, setIsToggled] = React.useState<boolean>(false);

  const handleToggle = () => setIsToggled(!isToggled);

  return (
    <>
      <div
        className={tw(apply`flex flex-row justify-between items-center cursor-pointer ${style}`)}
        onClick={handleToggle}
      >
        {titleNode}
        <Icon
          style="h-4, w-4 text-secondary-dark"
          type={isToggled ? 'ChevronUpIcon' : 'ChevronDownIcon'}
        />
      </div>
      {isToggled && <div className={tw('p-2')}>{contentNode}</div>}
    </>
  );
};

export default Accordion;
