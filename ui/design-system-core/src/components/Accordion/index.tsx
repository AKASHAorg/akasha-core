import React from 'react';

import Box from '../Box';
import Button from '../Button';
import Icon from '../Icon';

export interface IAccordionProps {
  customStyle?: string;
  contentStyle?: string;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
  open?: boolean;
}

const Accordion: React.FC<IAccordionProps> = props => {
  const { customStyle = '', contentStyle = '', titleNode, contentNode, open } = props;

  // internal state for accordion toggle
  const [isToggled, setIsToggled] = React.useState<boolean>(open);

  const handleToggle = () => setIsToggled(!isToggled);

  return (
    <>
      <Button plain={true} onClick={handleToggle} customStyle="w-full">
        <Box
          customStyle={`flex flex-row justify-between items-center cursor-pointer ${customStyle}`}
        >
          {titleNode}
          <Icon
            accentColor={true}
            customStyle="h-4, w-4 secondaryDark"
            type={isToggled ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          />
        </Box>
      </Button>

      {isToggled && <Box customStyle={`p-2 ${contentStyle}`}>{contentNode}</Box>}
    </>
  );
};

export default Accordion;
