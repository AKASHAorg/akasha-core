import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { ProfileAvatarButton } from '../Buttons/index';
import { Icon } from '../Icon';
import { NotificationsPopover } from '../Popovers/index';

const AvatarButton = styled(ProfileAvatarButton)`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: ${props => `${props.theme.shapes.baseSpacing * 2}px`};
  height: 2.5em;
  box-shadow: ${props => props.theme.colors.shadow};
`;

export interface ITopbarProps {
  className?: string;
  avatarImage?: string;
  ethAddress: string;
  userName: string;
  brandLabel: string | React.ReactElement;
  unreadNotifications?: number;
  notificationsData?: any[];
  onNotificationClick: () => void;
  onWalletClick: (ev: React.SyntheticEvent) => void;
  onNavigation?: (path: string) => void;
  onSidebarToggle?: (visibility: boolean) => void;
}

const TopbarWrapper = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

const Topbar = (props: ITopbarProps) => {
  const {
    avatarImage,
    brandLabel,
    className,
    userName,
    notificationsData,
    onNotificationClick,
    onNavigation,
    onSidebarToggle,
    ethAddress,
  } = props;
  const notificationIconRef: React.Ref<any> = React.useRef(null);
  const walletIconRef: React.Ref<any> = React.useRef(null);

  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [walletOpen, setWalletOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  const handleSidebarVisibility = () => {
    if (!sidebarOpen && onSidebarToggle) {
      onSidebarToggle(true);
      setSidebarOpen(true);
    } else if (sidebarOpen && onSidebarToggle) {
      onSidebarToggle(false);
      setSidebarOpen(false);
    }
  };

  return (
    <TopbarWrapper
      direction="row"
      pad="small"
      justify="between"
      align="center"
      fill={true}
      className={className}
    >
      <Box direction="row">
        <Icon type="plusGrey" onClick={handleSidebarVisibility} />
        {brandLabel}
      </Box>
      <Box direction="row">
        <Box
          ref={notificationIconRef}
          align="center"
          justify="center"
          margin={{ horizontal: 'xsmall' }}
        >
          <Icon
            type="notifications"
            onClick={handleNotifClick}
            clickable={true}
            primaryColor={true}
          />
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
            ethAddress={ethAddress}
            label={userName}
            size="xs"
            onClick={handleNavigation('/profile/my-profile')}
            onAvatarClick={handleNavigation('/profile/my-profile')}
          />
        </Box>
      </Box>
    </TopbarWrapper>
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
