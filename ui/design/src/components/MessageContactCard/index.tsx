import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import Button from '../Button';
import Icon, { IconType } from '../Icon';
import Avatar from '../Avatar';
import { IconDiv } from '../TopBar/styled-topbar';
import { ILocale } from '../../utils/time';
import CardHeaderMenuDropdown from '../EntryCard/card-header-menu';
import styled from 'styled-components';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export const StyledButton = styled(Button)`
  border-radius: 100px;
  height: 1rem;
  padding: 4px 11px;
  display: flex;
  align-items: center;
`;

export interface IMessageContactCardProps {
  locale: ILocale;
  senderName: Profile['name'];
  content?: string;
  isRead?: boolean;
  isPinned: boolean;
  hideBottomBorder?: boolean;
  pinConvoLabel: string;
  unpinConvoLabel: string;
  newMessageLabel?: string;
  senderAvatar: Profile['avatar'];
  senderProfileId: Profile['did']['id'];
  onClickAvatar?: () => void;
  onClickCard?: () => void;
  onConvoPin?: () => void;
}

const MessageContactCard: React.FC<IMessageContactCardProps> = props => {
  const {
    senderName,
    content,
    isRead,
    isPinned,
    hideBottomBorder,
    pinConvoLabel,
    unpinConvoLabel,
    newMessageLabel,
    senderAvatar,
    senderProfileId,
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
            avatar={senderAvatar}
            profileId={senderProfileId}
            onClick={handleAvatarClick}
          />
          <Box align="start" margin={{ left: 'small' }}>
            <Text size="xlarge" style={{ textTransform: 'capitalize' }}>
              {senderName}
            </Text>
            {/*<Text size="medium" color="secondaryText">*/}
            {/*  {`@${senderUsername}`}*/}
            {/*</Text>*/}
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
