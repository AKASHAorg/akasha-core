import { Box, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

import { Icon } from '../../Icon';

const ModalWrapper = styled(Box)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 199;
  background: ${props => props.theme.colors.modalBackground};
`;

const StyledBox = styled(Box)`
  width: calc(100% - 1rem);
  position: absolute;
  bottom: 1rem;
  left: 0.5rem;
`;

export interface IMobileListModal {
  className?: string;
  cancelLabel?: string;
  closeModal: () => void;
  menuItems: IMenuItem[];
}

interface IMenuItem {
  label: string;
  icon?: string;
  handler: (arg1?: any) => void;
}

const MobileListModal: React.FC<IMobileListModal> = props => {
  const { closeModal, menuItems, cancelLabel } = props;

  return (
    <ModalWrapper onClick={closeModal}>
      <StyledBox>
        <Box align="center" round="small" margin={{ bottom: 'medium' }}>
          {menuItems.map((menuItem, index) => (
            <Box
              round={
                index === 0
                  ? { corner: 'top', size: 'small' }
                  : index === menuItems.length - 1
                  ? { corner: 'bottom', size: 'small' }
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
              align="center"
              pad="medium"
              fill="horizontal"
              background="background"
            >
              <Box width="60%" align="start" direction="row">
                {menuItem.icon && <Icon type={menuItem.icon} size="md" clickable={false} />}
                <Text size="xlarge" margin={{ left: 'xsmall' }}>
                  {menuItem.label}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          pad="medium"
          onClick={closeModal}
          align="center"
          justify="center"
          round="small"
          background="background"
        >
          <Text color="secondaryText" size="xlarge">
            {cancelLabel}
          </Text>
        </Box>
      </StyledBox>
    </ModalWrapper>
  );
};

MobileListModal.defaultProps = {
  cancelLabel: 'Cancel',
};

export { MobileListModal };
