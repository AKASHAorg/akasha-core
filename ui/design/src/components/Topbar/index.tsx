import * as React from 'react';
import styled from 'styled-components';
import { Icon, IconLink } from '../../index';
import { ProfileAvatarButton } from '../IconButton';

const AvatarButton = styled(ProfileAvatarButton)`
  background-color: ${props => props.theme.colors.background};
  border-radius: 20px;
  padding: calc(2 * ${props => props.theme.spacing.padding.base});
`;

const StyledTopbar = styled.div`
  padding: 0 1em;
  align-items: center;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface ITopbarProps {
  avatarImage: string;
  userName: string;
  brandLabel: string | React.ReactElement;
  unreadNotifications?: number;
  onNotificationClick: (ev: React.SyntheticEvent) => void;
  onWalletClick: (ev: React.SyntheticEvent) => void;
  onNavigation?: (path: string) => void;
}

const StyledTopbarSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const Topbar = (props: ITopbarProps) => {
  const onNavigation = (path: string) => (ev: React.SyntheticEvent) => {
    if (props.onNavigation) {
      props.onNavigation(path);
    }
  };

  return (
    <StyledTopbar>
      <StyledTopbarSection>{props.brandLabel}</StyledTopbarSection>
      <StyledTopbarSection style={{}}>
        <IconLink
          icon={<Icon type="notifications" />}
          label=""
          onClick={props.onNotificationClick}
          size="xsmall"
        />
        <IconLink
          icon={<Icon type="wallet" />}
          label=""
          onClick={props.onWalletClick}
          size="xsmall"
        />
        <div style={{ marginLeft: '0.5em' }}>
          <AvatarButton
            avatarImage={props.avatarImage}
            label={props.userName}
            size="small"
            onClick={onNavigation('/profile/my-profile')}
            onAvatarClick={onNavigation('/profile/my-profile')}
          />
        </div>
      </StyledTopbarSection>
    </StyledTopbar>
  );
};

Topbar.defaultProps = {
  onNotificationClick: () => {},
  onWalletClick: () => {},
  onNavigation: () => {},
  unreadNotifications: 0,
};

export default Topbar;
