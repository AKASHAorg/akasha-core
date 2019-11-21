import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '../../index';
import { ProfileAvatarButton } from '../IconButton';
import { NotificationsPopover } from '../Popovers/index';

const AvatarButton = styled(ProfileAvatarButton)`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border}
  border-radius: 20px;
  padding: ${props => `${props.theme.shapes.baseSpacing * 2}px`};
  height: 40px;
  box-shadow: ${props => props.theme.colors.shadow}
`;

interface ITopbarProps {
  className?: string;
  ethAddress: string;
  avatarImage: string;
  userName: string;
  brandLabel: string | React.ReactElement;
  unreadNotifications?: number;
  notificationsData?: any[];
  onNotificationClick: () => void;
  onWalletClick: (ev: React.SyntheticEvent) => void;
  onNavigation?: (path: string) => void;
}

const Topbar = (props: ITopbarProps) => {
  const {
    avatarImage,
    brandLabel,
    className,
    ethAddress,
    userName,
    notificationsData,
    onNotificationClick,
    onNavigation,
  } = props;
  const notificationIconRef: React.Ref<any> = React.useRef(null);
  const walletIconRef: React.Ref<any> = React.useRef(null);

  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [walletOpen, setWalletOpen] = React.useState(false);

  const handleNavigation = (path: string) => () => {
    if (onNavigation) {
      onNavigation(path);
    }
  };

  const handleNotifClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleWalletClick = () => {
    setWalletOpen(!walletOpen);
  };

  const closePopover = () => {
    setNotificationsOpen(false);
  };

  return (
    <Box
      direction="row"
      pad="small"
      justify="between"
      align="center"
      fill={true}
      className={className}
    >
      <Box direction="row">{brandLabel}</Box>
      <Box direction="row">
        <Box
          ref={notificationIconRef}
          align="center"
          justify="center"
          margin={{ horizontal: 'xsmall' }}
        >
          <Icon type="notifications" onClick={handleNotifClick} clickable={true} default={true} />
        </Box>

        {notificationIconRef.current && notificationsOpen && notificationsData && (
          <NotificationsPopover
            target={notificationIconRef.current}
            dataSource={notificationsData}
            onClickNotification={onNotificationClick}
            closePopover={closePopover}
          />
        )}
        <Box ref={walletIconRef} align="center" justify="center" margin="xsmall">
          <Icon type="wallet" onClick={handleWalletClick} clickable={true} />
        </Box>

        <Box pad={{ left: 'xsmall' }}>
          <AvatarButton
            avatarImage={avatarImage}
            label={userName}
            size="xs"
            onClick={handleNavigation('/profile/my-profile')}
            onAvatarClick={handleNavigation('/profile/my-profile')}
            seed={ethAddress}
          />
        </Box>
      </Box>
    </Box>
  );
};

Topbar.defaultProps = {
  onNotificationClick: () => {
    return;
  },
  onWalletClick: () => {
    return;
  },
  onNavigation: () => {
    return;
  },
  unreadNotifications: 0,
};

export default Topbar;
