import React from 'react';
import { tw } from '@twind/core';

import Icon from '../Icon';

export interface IAccordionProps {
  className?: string;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
}

const Accordion: React.FC<IAccordionProps> = props => {
  const { className, titleNode, contentNode } = props;

  // internal state for accordion toggle
  const [isToggled, setIsToggled] = React.useState<boolean>(false);

  const handleToggle = () => setIsToggled(!isToggled);

  return (
    <>
      <div
        className={tw(`flex flex-row justify-between items-center cursor-pointer ${className}`)}
        onClick={handleToggle}
      >
        {titleNode}
        <Icon
          styling={tw('h-4, w-4 text-secondary-dark')}
          icon={isToggled ? 'ChevronUpIcon' : 'ChevronDownIcon'}
        />
      </div>
      {isToggled && <div className={tw('p-2')}>{contentNode}</div>}
    </>
  );
};

export default Accordion;
