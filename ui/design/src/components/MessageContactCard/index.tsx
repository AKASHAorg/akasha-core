import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import { IProfileData } from '@akashaorg/typings/ui';
import Button from '../Button';
import Icon, { IconType } from '../Icon';
import Avatar from '../Avatar';
import { IconDiv } from '../TopBar/styled-topbar';
import { ILocale } from '../../utils/time';
import CardHeaderMenuDropdown from '../EntryCard/card-header-menu';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  border-radius: 100px;
  height: 1rem;
  padding: 4px 11px;
  display: flex;
  align-items: center;
`;

export interface IMessageContactCardProps {
  locale: ILocale;
  senderName: IProfileData['name'];
  senderUsername: IProfileData['userName'];
  content?: string;
  isRead?: boolean;
  isPinned: boolean;
  hideBottomBorder?: boolean;
  pinConvoLabel: string;
  unpinConvoLabel: string;
  newMessageLabel?: string;
  senderAvatar: IProfileData['avatar'];
  senderEthAddress: IProfileData['ethAddress'];
  onClickAvatar?: () => void;
  onClickCard?: () => void;
  onConvoPin?: () => void;
}

const MessageContactCard: React.FC<IMessageContactCardProps> = props => {
  const {
    senderName,
    senderUsername,
    content,
    isRead,
    isPinned,
    hideBottomBorder,
    pinConvoLabel,
    unpinConvoLabel,
    newMessageLabel,
    senderAvatar,
    senderEthAddress,
    onClickAvatar,
    onClickCard,
    onConvoPin,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const showCardMenu = React.useMemo(
    () => !isMobileOnly && menuIconRef.current && menuDropOpen,
    [menuDropOpen],
  );

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    setMenuDropOpen(!menuDropOpen);
  };

  const handlePinConvo = () => {
    if (onConvoPin) {
      onConvoPin();
    }
  };

  const handleAvatarClick = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    if (onClickAvatar) {
      onClickAvatar();
    }
  };

  return (
    <Box
      pad="small"
      onClick={onClickCard}
      flex={{ shrink: 0 }}
      border={hideBottomBorder ? { side: 'top' } : { side: 'horizontal' }}
    >
      <Box direction="row" justify="between">
        <Box direction="row" align="start">
          <Avatar
            size="lg"
            src={senderAvatar}
            ethAddress={senderEthAddress}
            onClick={handleAvatarClick}
          />
          <Box align="start" margin={{ left: 'small' }}>
            <Text size="xlarge" style={{ textTransform: 'capitalize' }}>
              {senderName}
            </Text>
            <Text size="medium" color="secondaryText">
              {`@${senderUsername}`}
            </Text>
            <Text
              size="large"
              margin={{ top: 'xsmall' }}
              color={isRead ? 'secondaryText' : 'primaryText'}
              style={{
                maxWidth: '11.75rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {content}
            </Text>
          </Box>
        </Box>
        <Box direction="row" height="fit-content" flex={{ shrink: 0 }} align="center" gap="small">
          {!isRead && <StyledButton size="small" label={newMessageLabel} primary={true} />}
          <IconDiv
            onClick={(ev: React.MouseEvent<HTMLDivElement>) => toggleMenuDrop(ev)}
            isActive={menuDropOpen}
            isMobile={isMobileOnly}
            ref={menuIconRef}
          >
            <Icon accentColor={menuDropOpen} type="moreDark" />
          </IconDiv>
        </Box>
        {showCardMenu && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            menuItems={[
              {
                icon: isPinned ? ('unpinAlt' as IconType) : ('pinAlt' as IconType),
                handler: handlePinConvo,
                label: isPinned ? unpinConvoLabel : pinConvoLabel,
                iconColor: 'primaryText',
                plain: true,
              },
            ]}
          />
        )}
      </Box>
    </Box>
  );
};

export default MessageContactCard;
