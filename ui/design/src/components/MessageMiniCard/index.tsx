import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

import Icon, { IconType } from '../Icon';
import Avatar from '../Avatar';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { IconDiv } from '../TopBar/styled-topbar';
import { formatRelativeTime, ILocale } from '../../utils/time';
import CardHeaderMenuDropdown from '../EntryCard/card-header-menu';

export interface IMessageAppMiniCardProps {
  locale: ILocale;
  sender: IProfileData['name'];
  senderUsername: IProfileData['userName'];
  content: string;
  isRead: boolean;
  isPinned: boolean;
  pinConvoLabel: string;
  unpinConvoLabel: string;
  latestChatTimestamp: string;
  senderAvatar: IProfileData['avatar'];
  senderEthAddress: IProfileData['ethAddress'];
  onClickAvatar?: () => void;
  onClickCard?: () => void;
  onConvoPin: () => void;
}

const MessageAppMiniCard: React.FC<IMessageAppMiniCardProps> = props => {
  const {
    locale,
    sender,
    senderUsername,
    content,
    isRead,
    isPinned,
    pinConvoLabel,
    unpinConvoLabel,
    latestChatTimestamp,
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

  return (
    <BasicCardBox
      noBorderRadius
      style={{ minHeight: 'min-content' }} // allows cards to adjust in a y-scrollable container
    >
      <Box pad="small" onClick={onClickCard} style={{ cursor: 'pointer' }}>
        <Box direction="row" justify="between">
          <Box direction="row" align="start">
            <Avatar
              size="lg"
              src={senderAvatar}
              ethAddress={senderEthAddress}
              onClick={onClickAvatar}
            />
            <Box align="start" margin={{ left: 'small' }}>
              <Text size="xlarge" style={{ textTransform: 'capitalize' }}>
                {sender}
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
          <Box direction="row" height="fit-content" flex={{ shrink: 0 }} align="start">
            <Text
              size="large"
              color="secondaryText"
              alignSelf="center"
              margin={{ right: 'xsmall' }}
              style={{ lineHeight: 'initial' }}
            >
              {formatRelativeTime(latestChatTimestamp, locale)}
            </Text>
            <IconDiv
              onClick={(ev: React.MouseEvent<HTMLDivElement>) => toggleMenuDrop(ev)}
              isActive={menuDropOpen}
              isMobile={isMobileOnly}
              ref={menuIconRef}
            >
              <Icon plain={true} accentColor={menuDropOpen} type="moreDark" />
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
    </BasicCardBox>
  );
};

export default MessageAppMiniCard;
