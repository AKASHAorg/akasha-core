import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Icon, IconLink } from '../../index';
import { ProfileAvatarButton } from '../IconButton';
import { NotificationsPopover } from '../Popovers/index';

const AvatarButton = styled(ProfileAvatarButton)`
  background-color: ${props => props.theme.colors.lightBackground};
  border-radius: 20px;
  padding: ${props => `${props.theme.shapes.baseSpacing * 2}px`};
  height: 40px;
`;

interface ITopbarProps {
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
    userName,
    unreadNotifications,
    notificationsData,
    onNotificationClick,
    onNavigation,
  } = props;
  const notificationIconRef: React.Ref<any> = React.useRef();
  const walletIconRef: React.Ref<any> = React.useRef();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [walletOpen, setWalletOpen] = React.useState(false);
  const handleNavigation = (path: string) => (ev: React.SyntheticEvent) => {
    if (onNavigation) {
      onNavigation(path);
    }
  };

  return (
    <Box direction="row" pad="small" justify="between" align="center" fill={true}>
      <Box direction="row">{brandLabel}</Box>
      <Box direction="row">
        <Box
          ref={notificationIconRef}
          align="center"
          justify="center"
          margin={{ horizontal: 'xsmall' }}
        >
          <Icon
            type="notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            clickable={true}
            default={true}
          />
        </Box>

        {notificationIconRef.current && notificationsOpen && notificationsData && (
          <NotificationsPopover
            target={notificationIconRef.current}
            dataSource={notificationsData}
            onClickNotification={onNotificationClick}
            closePopover={() => setNotificationsOpen(false)}
          />
        )}
        <Box ref={walletIconRef} align="center" justify="center" margin="xsmall">
          <Icon type="wallet" onClick={() => setWalletOpen(!walletOpen)} clickable={true} />
        </Box>

        <Box pad={{ left: 'xsmall' }}>
          <AvatarButton
            avatarImage={avatarImage}
            label={userName}
            size="xs"
            onClick={handleNavigation('/profile/my-profile')}
            onAvatarClick={handleNavigation('/profile/my-profile')}
          />
        </Box>
      </Box>
    </Box>
  );
};

Topbar.defaultProps = {
  onNotificationClick: () => {},
  onWalletClick: () => {},
  onNavigation: () => {},
  unreadNotifications: 0,
};

export default Topbar;
