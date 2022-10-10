import React from 'react';
import dayjs from 'dayjs';
import { Box, Text, ThemeContext } from 'grommet';

import TextIcon from '../TextIcon';
import Icon, { IconType } from '../Icon';
import { IMenuItem } from '../MobileListModal';

import { StyledDrop, StyledSelectBox } from '../EntryCard/styled-entry-box';

export type DevKeyCardType = {
  pubKey: string;
  name?: string;
  addedAt: string;
  usedAt?: string;
};

export interface IDevKeyCardProps {
  item?: DevKeyCardType;
  nonameLabel: string;
  usedLabel: string;
  unusedLabel: string;
  pendingConfirmationLabel?: string;
  devPubKeyLabel: string;
  dateAddedLabel: string;
  menuItems?: IMenuItem[];
  onCopyClick?: (value: string) => () => void;
}

const DevKeyCard: React.FC<IDevKeyCardProps> = props => {
  const {
    item,
    nonameLabel,
    pendingConfirmationLabel,
    usedLabel,
    unusedLabel,
    devPubKeyLabel,
    dateAddedLabel,
    menuItems,
    onCopyClick,
  } = props;

  const theme: any = React.useContext(ThemeContext);

  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const handleMenuClose = () => setShowMenu(false);

  const handleClick = (handler: IMenuItem['handler']) => () => {
    handler();
    return handleMenuClose();
  };

  return (
    <Box gap="small" style={{ position: 'relative' }}>
      <Box direction="row" align="center" justify="between">
        <Box direction="row" gap="xxsmall" align="center">
          <Text size="large" weight="bold">
            {item?.name?.length ? item?.name : nonameLabel}
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
                  color={menuItem?.iconColor ? menuItem?.iconColor : theme.colors.errorText}
                  iconSize="xs"
                  fontSize="medium"
                />
              </StyledSelectBox>
            ))}
          </StyledDrop>
        )}
      </Box>
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
