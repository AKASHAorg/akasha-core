import React from 'react';
import dayjs from 'dayjs';
import { Box, Drop, Text } from 'grommet';
import styled from 'styled-components';

import TextIcon from '../TextIcon';
import Icon, { IconType } from '../Icon';
import { IMenuItem } from '../MobileListModal';

export type DevKeyCardType = {
  pubKey: string;
  name?: string;
  addedAt: string;
  usedAt?: string;
};

export interface IDevKeyCardProps {
  item?: DevKeyCardType;
  usedLabel: string;
  unusedLabel: string;
  pendingConfirmationLabel?: string;
  devPubKeyLabel: string;
  dateAddedLabel: string;
  menuItems?: IMenuItem[];
  onCopyClick?: (value: string) => () => void;
}

const StyledDrop = styled(Drop)`
  z-index: 10;
  position: fixed;
  left: 823px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledSelectBox = styled(Box)`
  padding: ${props => `${props.theme.shapes.baseSpacing}px`};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  &:hover {
    background-color: ${props => props.theme.colors.hoverBackground};
    cursor: pointer;
  }
`;

const DevKeyCard: React.FC<IDevKeyCardProps> = props => {
  const {
    item,
    pendingConfirmationLabel,
    usedLabel,
    unusedLabel,
    devPubKeyLabel,
    dateAddedLabel,
    menuItems,
    onCopyClick,
  } = props;

  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const handleMenuClose = () => setShowMenu(false);

  const handleClick = (handler: IMenuItem['handler']) => () => {
    handler();
    return handleMenuClose();
  };

  return (
    <Box gap="small" style={{ position: 'relative' }}>
      <Box direction="row" gap="xxsmall" align="center" justify="between">
        <Box direction="row" gap="xxsmall" align="center">
          <Text size="large" weight="bold">
            {item?.name}
          </Text>
          <Box
            width="0.5rem"
            height="0.5rem"
            round={true}
            background={item?.usedAt ? 'green' : 'brown'}
          />

          {pendingConfirmationLabel && <Text size="large">{pendingConfirmationLabel}</Text>}

          {!pendingConfirmationLabel && (
            <Text size="large">{item?.usedAt ? usedLabel : unusedLabel}</Text>
          )}
        </Box>
        {!!menuItems?.length && (
          <Icon
            type="moreDark"
            plain={true}
            onClick={() => setShowMenu(true)}
            clickable={true}
            ref={menuIconRef}
          />
        )}
      </Box>
      {showMenu && menuIconRef.current && (
        <StyledDrop
          overflow="hidden"
          target={menuIconRef.current}
          align={{ top: 'bottom', right: 'right' }}
          onClickOutside={handleMenuClose}
          onEsc={handleMenuClose}
        >
          {menuItems.map((menuItem, idx) => (
            <StyledSelectBox key={`${menuItem?.label}-${idx}`}>
              <TextIcon
                iconType={menuItem?.icon as IconType}
                label={menuItem?.label}
                onClick={handleClick(menuItem?.handler)}
                color={menuItem?.iconColor}
                iconSize="xs"
                fontSize="medium"
              />
            </StyledSelectBox>
          ))}
        </StyledDrop>
      )}
      <Box>
        <Text size="small" weight="bold" style={{ textTransform: 'uppercase' }}>
          {devPubKeyLabel}
        </Text>
        <Box direction="row" gap="small">
          <Text size="large" color="secondaryText">
            {item?.pubKey}
          </Text>
          <Icon
            type="copy"
            color="secondaryText"
            style={{ cursor: 'pointer' }}
            onClick={onCopyClick(item?.pubKey)}
          />
        </Box>
      </Box>
      <Box>
        <Text size="small" weight="bold" style={{ textTransform: 'uppercase' }}>
          {dateAddedLabel}
        </Text>
        <Box direction="row" gap="small">
          <Text size="large" color="secondaryText">
            {dayjs(item?.addedAt).format('DD/MM/YYYY')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DevKeyCard;
