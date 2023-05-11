import * as React from 'react';
import { DropButton, DropButtonExtendedProps, Box } from 'grommet';
import styled from 'styled-components';
import Icon from '../Icon';

const StyledDropButton = styled(DropButton)``;

interface DropdownMenuProps extends Omit<DropButtonExtendedProps, 'dropContent'> {
  options: { id: string; item: React.ReactElement }[];
  selectedOption: DropdownMenuProps['options'][number];
}

const defaultAlign = { top: 'bottom' };

const DropdownMenu: React.FC<DropdownMenuProps> = props => {
  const { options, selectedOption, ...rest } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <StyledDropButton
      closeOnClick={true}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      pad="none"
      dropProps={{ align: defaultAlign }}
      dropContent={
        <Box
          direction="column"
          align="center"
          border={{ size: 'xsmall' }}
          pad={{ vertical: 'small' }}
          round="4px"
        >
          {options.map((option, idx) => (
            <DrodownMenuItem key={`${option.id}_${idx}`} onClose={() => setOpen(false)}>
              {React.cloneElement(option.item, { onClose: () => setOpen(false) })}
            </DrodownMenuItem>
          ))}
        </Box>
      }
      {...rest}
    >
      <Box direction="row" pad="xsmall" border={{ color: 'border', size: 'xsmall' }} round="4px">
        {selectedOption.item}
        <Icon type="dropdown" size="xxs" />
      </Box>
    </StyledDropButton>
  );
};
type DropdownItemProps = {
  onClose: () => void;
  children?: React.ReactNode;
};
const DrodownMenuItem: React.FC<DropdownItemProps> = ({ children, onClose }) => {
  return (
    <Box margin={{ vertical: 'small' }} onClick={onClose}>
      {children}
    </Box>
  );
};

export default DropdownMenu;
