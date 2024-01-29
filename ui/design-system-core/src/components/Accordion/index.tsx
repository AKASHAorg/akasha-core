import React, { useMemo } from 'react';

import Divider from '../Divider';
import Icon from '../Icon';
import { ChevronDownIcon, ChevronUpIcon } from '../Icon/hero-icons-outline';
import Stack from '../Stack';
import Card from '../Card';

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

  const handleToggle = () => handleClick(accordionId);

  const headerUi = useMemo(
    () => (
      <Stack direction="row" align="center" justify="between" customStyle={customStyle}>
        {titleNode}
        <Icon
          accentColor={true}
          customStyle="h-4, w-4"
          icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        />
      </Stack>
    ),
    [customStyle, open, titleNode],
  );

  return (
    <>
      <Card type="plain" onClick={handleToggle} customStyle="w-full">
        {headerDivider ? (
          <Stack direction="column" spacing="gap-y-4">
            {headerUi}
            <Divider />
          </Stack>
        ) : (
          headerUi
        )}
      </Card>

      {open && <Stack customStyle={`${contentStyle}`}>{contentNode}</Stack>}
    </>
  );
};

export default Accordion;
