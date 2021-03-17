import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { IProfileData } from '../../Cards/profile-cards/profile-widget-card';
import * as React from 'react';
import { Box } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import { SubtitleTextIcon, TextIcon } from '../../TextIcon';
import { ProfileAvatarButton } from '../../Buttons';
import { StyledDrop, StyledPopoverBox, StyledOverlay } from './styled-topbar';
import { ModalContainer } from '../../Modals/common/fullscreen-modal-container';
import { Portal } from '../../Editor/helpers';
import { Icon } from '../../Icon';

export interface IProfileMenu {
  loggedProfileData: Partial<IProfileData>;
  menuItems: IMenuItem[];
  target: HTMLElement;

  // labels
  signOutLabel?: string;
  feedbackLabel?: string;
  feedbackInfoLabel?: string;
  // handlers
  closePopover: () => void;
  onNavigation: (path: string) => void;
  onLogout: any;
}

const ProfileMenu: React.FC<IProfileMenu> = props => {
  const {
    loggedProfileData,
    menuItems,
    target,
    closePopover,
    onNavigation,
    signOutLabel,
    feedbackLabel,
    feedbackInfoLabel,
    onLogout,
  } = props;

  const handleNavigation = (menuItem: IMenuItem) => () => {
    if (onNavigation) {
      onNavigation(menuItem.route);
    }
    closePopover();
  };

  const renderAvatarMenuItem = (menuItem: IMenuItem) => {
    if (menuItem.label === 'My Profile') {
      return (
        <>
          <Box
            border={{ style: 'solid', size: '1px', color: 'border', side: 'bottom' }}
            justify="start"
            direction="row"
          >
            <StyledPopoverBox pad="xsmall" margin={{ bottom: 'xsmall' }}>
              <ProfileAvatarButton
                ethAddress={loggedProfileData?.ethAddress as string}
                avatarImage={loggedProfileData?.avatar}
                label={loggedProfileData?.name}
                info={
                  loggedProfileData?.userName
                    ? `@${loggedProfileData.userName.replace('@', '')}`
                    : undefined
                }
              />
            </StyledPopoverBox>
          </Box>
          <Box
            border={{ style: 'solid', size: '1px', color: 'border', side: 'bottom' }}
            justify="start"
            direction="row"
          >
            <StyledPopoverBox pad="xsmall" margin={{ vertical: 'xsmall' }}>
              <SubtitleTextIcon
                label={feedbackLabel}
                subtitle={feedbackInfoLabel}
                subtitleColor={'secondaryText'}
                iconType="feedback"
                iconSize={'1.250rem'}
              />
            </StyledPopoverBox>
          </Box>
        </>
      );
    }
    return (
      <StyledPopoverBox pad="xsmall" fill="horizontal" justify="start">
        <TextIcon label={menuItem.label} iconType="legal" />
      </StyledPopoverBox>
    );
  };

  const renderProfileMenu = () => (
    <Box pad="xsmall" align="center" justify="start" gap="xsmall">
      {menuItems.map((menuItem: IMenuItem, index: number) => (
        <Box fill="horizontal" onClick={handleNavigation(menuItem)} key={index}>
          {renderAvatarMenuItem(menuItem)}
        </Box>
      ))}

      <StyledPopoverBox pad="xsmall" onClick={onLogout} fill="horizontal" justify="start">
        <TextIcon label={signOutLabel} iconType="signOut" />
      </StyledPopoverBox>
    </Box>
  );

  const renderProfileDrop = () => (
    <StyledDrop
      target={target}
      onClickOutside={closePopover}
      onEsc={closePopover}
      align={{ top: 'bottom', right: 'right' }}
    >
      <Box round="xxsmall" border={{ style: 'solid', size: '1px', color: 'border', side: 'all' }}>
        {renderProfileMenu()}
      </Box>
    </StyledDrop>
  );

  const renderProfileOverlay = () => (
    <Portal>
      <ModalContainer
        onModalClose={closePopover}
        style={{ alignItems: 'flex-end' }}
        animation={{
          type: 'slideLeft',
          duration: 250,
          delay: 0,
        }}
      >
        <StyledOverlay border={{ style: 'solid', size: '1px', color: 'border', side: 'left' }}>
          <Box pad="small">
            <Box direction="row" justify="end" align="center">
              <Icon type="close" onClick={closePopover} primaryColor={true} />
            </Box>

            {renderProfileMenu()}
          </Box>
        </StyledOverlay>
      </ModalContainer>
    </Portal>
  );
  return <>{isMobileOnly ? renderProfileOverlay() : renderProfileDrop()} </>;
};

export { ProfileMenu };
