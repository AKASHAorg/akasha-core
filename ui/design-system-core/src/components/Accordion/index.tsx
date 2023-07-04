import React, { useCallback, useMemo } from 'react';
import Box from '../Box';
import Button from '../Button';
import Icon from '../Icon';
import Stack from '../Stack';
import Divider from '../Divider';

export interface IAccordionProps {
  customStyle?: string;
  contentStyle?: string;
  titleNode: React.ReactNode;
  contentNode: React.ReactNode;
  open?: boolean;
  headerDivider?: boolean;
}

const Accordion: React.FC<IAccordionProps> = props => {
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
      <Button plain={true} onClick={handleToggle} customStyle="w-full">
        <Stack align="center" justify="between" customStyle={customStyle}>
          {titleNode}
          <Icon
            accentColor={true}
            customStyle="h-4, w-4 secondaryDark"
            type={isToggled ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          />
        </Stack>
      </Button>
    ),
    [customStyle, handleToggle, isToggled, titleNode],
  );

  return (
    <>
      {headerDivider ? (
        <Stack direction="column" spacing="gap-y-4">
          {headerUi}
          <Divider />
        </Stack>
      ) : (
        <>{headerUi}</>
      )}

      {isToggled && <Box customStyle={`${contentStyle}`}>{contentNode}</Box>}
    </>
  );
};

export default Accordion;
