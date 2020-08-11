import { Box, Text, Layer } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

const StyledLayer = styled(Layer)`
  background-color: transparent;
`;

export interface IMobileListModal {
  className?: string;
  cancelLabel?: string;
  closeModal: () => void;
  menuItems: IMenuItem[];
}

interface IMenuItem {
  label: string;
  handler: () => void;
}

const MobileListModal: React.FC<IMobileListModal> = props => {
  const { closeModal, menuItems, cancelLabel, className } = props;

  return (
    <StyledLayer modal={true} className={className} position="bottom" margin={{ bottom: 'small' }}>
      <Box align="center" round="xsmall" margin={{ bottom: 'small' }}>
        {menuItems.map((menuItem, index) => (
          <Box
            round={
              index === 0
                ? { corner: 'top', size: 'xsmall' }
                : index === menuItems.length - 1
                ? { corner: 'bottom', size: 'xsmall' }
                : undefined
            }
            border={
              index < menuItems.length - 1 && {
                color: 'border',
                size: 'xsmall',
                style: 'solid',
                side: 'bottom',
              }
            }
            key={index}
            onClick={menuItem.handler}
            justify="center"
            align="center"
            pad="small"
            fill="horizontal"
            background="background"
          >
            <Text>{menuItem.label}</Text>
          </Box>
        ))}
      </Box>
      <Box
        pad="small"
        onClick={closeModal}
        align="center"
        justify="center"
        round="xsmall"
        background="background"
      >
        <Text color="secondaryText">{cancelLabel}</Text>
      </Box>
    </StyledLayer>
  );
};

MobileListModal.defaultProps = {
  cancelLabel: 'Cancel',
};

export { MobileListModal };
