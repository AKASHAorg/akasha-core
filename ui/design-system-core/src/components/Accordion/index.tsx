import React, { useCallback, useMemo } from 'react';

import Button from '../Button';
import Divider from '../Divider';
import Icon from '../Icon';
import Stack from '../Stack';

export type AccordionProps = {
  customStyle?: string;
  contentStyle?: string;
  accordionId: number;
  open: boolean;
  headerDivider?: boolean;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
  handleClick: (id: number) => void;
};

const Accordion: React.FC<AccordionProps> = props => {
  const {
    customStyle = '',
    contentStyle = '',
    accordionId,
    open,
    headerDivider,
    titleNode,
    contentNode,
    handleClick,
  } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleToggle = useCallback(() => handleClick(accordionId), []);

  const headerUi = useMemo(
    () => (
      <Stack direction="row" align="center" justify="between" customStyle={customStyle}>
        {titleNode}
        <Icon
          accentColor={true}
          customStyle="h-4, w-4 secondaryDark"
          type={open ? 'ChevronUpIcon' : 'ChevronDownIcon'}
        />
      </Stack>
    ),
    [customStyle, open, titleNode],
  );

  return (
    <>
      {headerDivider ? (
        <Button plain={true} onClick={handleToggle} customStyle="w-full">
          <Stack direction="column" spacing="gap-y-4">
            {headerUi}
            <Divider />
          </Stack>
        </Button>
      ) : (
        <Button plain={true} onClick={handleToggle} customStyle="w-full">
          {headerUi}
        </Button>
      )}

      {open && <Stack customStyle={`${contentStyle}`}>{contentNode}</Stack>}
    </>
  );
};

export default Accordion;
