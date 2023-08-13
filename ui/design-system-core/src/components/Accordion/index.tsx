import React, { useCallback, useMemo } from 'react';

import Box from '../Box';
import Button from '../Button';
import Divider from '../Divider';
import Icon from '../Icon';
import Stack from '../Stack';

export type AccordionProps = {
  customStyle?: string;
  contentStyle?: string;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
  open?: boolean;
  headerDivider?: boolean;
};

const Accordion: React.FC<AccordionProps> = props => {
  const {
    customStyle = '',
    contentStyle = '',
    titleNode,
    contentNode,
    open,
    headerDivider,
  } = props;

  // internal state for accordion toggle
  const [isToggled, setIsToggled] = React.useState<boolean>(open);

  const handleToggle = useCallback(() => setIsToggled(!isToggled), [isToggled]);

  const headerUi = useMemo(
    () => (
      <Stack align="center" justify="between" customStyle={customStyle}>
        {titleNode}
        <Icon
          accentColor={true}
          customStyle="h-4, w-4 secondaryDark"
          type={isToggled ? 'ChevronUpIcon' : 'ChevronDownIcon'}
        />
      </Stack>
    ),
    [customStyle, isToggled, titleNode],
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

      {isToggled && <Box customStyle={`${contentStyle}`}>{contentNode}</Box>}
    </>
  );
};

export default Accordion;
