import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { IProfileData } from '../ProfileCard/profile-widget-card';
import * as React from 'react';
import { Accordion, Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import TextIcon from '../TextIcon';
import Icon, { IconType } from '../Icon';
import SubtitleTextIcon from '../SubtitleTextIcon';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { StyledDrop, StyledPopoverBox, StyledOverlay, StyledAccordionPanel } from './styled-topbar';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';
import { ModalRenderer } from '../SignInModal/modal-renderer';

export interface IProfileMenu {
  loggedProfileData?: Partial<IProfileData>;
  menuItems?: IMenuItem[];
  legalMenu: IMenuItem | null;
  target: HTMLElement;
  // labels
  legalLabel?: string;
  signOutLabel?: string;
  feedbackLabel?: string;
  feedbackInfoLabel?: string;
  moderationLabel?: string;
  moderationInfoLabel?: string;
  mobileSignedOutView?: boolean;
  legalCopyRightLabel?: string;
  // moderator tools
  isModerator?: boolean;
  dashboardLabel?: string;
  dashboardInfoLabel?: string;
  // handlers
  closePopover: () => void;
  onNavigation: (path: string) => void;
  onFeedbackClick: () => void;
  onModerationClick: () => void;
  onDashboardClick: () => void;
  onLogout?: () => void;
  modalSlotId: string;
}

interface ISimilarMenu {
  icon: IconType;
  labels: (string | undefined)[];
  handler: () => void;
  preventRender?: boolean;
}

const ProfileMenu: React.FC<IProfileMenu> = props => {
  const {
    loggedProfileData,
    menuItems,
    legalMenu,
    target,
    legalLabel,
    signOutLabel,
    feedbackLabel,
    feedbackInfoLabel,
    moderationLabel,
    moderationInfoLabel,
    mobileSignedOutView,
    legalCopyRightLabel,
    isModerator,
    dashboardLabel,
    dashboardInfoLabel,
    closePopover,
    onNavigation,
    onFeedbackClick,
    onModerationClick,
    onDashboardClick,
    onLogout,
    modalSlotId,
  } = props;

  const handleNavigation = (menuItem: IMenuItem) => () => {
    if (onNavigation) {
      onNavigation(menuItem.route);
    }
    closePopover();
  };

  const handleFeedbackClick = () => {
    if (onFeedbackClick) {
      onFeedbackClick();
    }
    closePopover();
  };

  const handleModerationClick = () => {
    if (onModerationClick) {
      onModerationClick();
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
          >
            <StyledPopoverBox pad="xsmall" margin={{ vertical: 'xsmall' }} responsive={false}>
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
        </>
      );
    }
    return null;
  };

  const similarMenu: ISimilarMenu[] = [
    { icon: 'feedback', labels: [feedbackLabel, feedbackInfoLabel], handler: handleFeedbackClick },
    {
      icon: 'trendingApps',
      labels: [dashboardLabel, dashboardInfoLabel],
      handler: onDashboardClick,
      preventRender: !isModerator,
    },
    {
      icon: 'book',
      labels: [moderationLabel, moderationInfoLabel],
      handler: handleModerationClick,
    },
  ];

  const renderProfileMenu = () => (
    <Box pad="xsmall" direction="column" align="center">
      {loggedProfileData?.ethAddress &&
        menuItems?.map((menuItem: IMenuItem, index: number) => (
          <Box fill="horizontal" onClick={handleNavigation(menuItem)} key={index}>
            {renderAvatarMenuItem(menuItem)}
          </Box>
        ))}
      {similarMenu.map((menu, idx) => {
        if (menu.preventRender) return null;
        return (
          <Box
            key={menu.icon + idx}
            border={{ style: 'solid', size: '1px', color: 'border', side: 'bottom' }}
            justify="start"
            fill="horizontal"
          >
            <StyledPopoverBox
              pad="xsmall"
              margin={{ vertical: 'xsmall' }}
              align="start"
              onClick={menu.handler}
              responsive={false}
            >
              <SubtitleTextIcon
                label={menu.labels[0]}
                subtitle={menu.labels[1]}
                subtitleColor={'secondaryText'}
                iconType={menu.icon}
                iconSize={'1.250rem'}
              />
            </StyledPopoverBox>
          </Box>
        );
      })}
      <Box
        border={
          loggedProfileData?.ethAddress
            ? { style: 'solid', size: '1px', color: 'border', side: 'bottom' }
            : undefined
        }
        fill="horizontal"
      >
        <Accordion fill="horizontal">
          <StyledAccordionPanel
            label={
              <StyledPopoverBox pad="xsmall" fill="horizontal" justify="start" responsive={false}>
                <TextIcon label={legalLabel} iconType="legal" />
              </StyledPopoverBox>
            }
          >
            {legalMenu?.subRoutes?.map((menuItem: IMenuItem, index: number) => (
              <StyledPopoverBox
                key={index}
                onClick={handleNavigation(menuItem)}
                pad={{ left: 'medium', vertical: 'small' }}
                responsive={false}
              >
                <Text>{menuItem.label}</Text>
              </StyledPopoverBox>
            ))}
            <Box pad={{ left: 'medium', vertical: 'small' }}>
              <Text color="secondaryText" size="small">
                {legalCopyRightLabel}
              </Text>
            </Box>
          </StyledAccordionPanel>
        </Accordion>
      </Box>
      {loggedProfileData?.ethAddress && onLogout && (
        <Box fill="horizontal" justify="start">
          <StyledPopoverBox
            pad="xsmall"
            margin={{ vertical: 'xsmall' }}
            onClick={onLogout}
            fill="horizontal"
            justify="start"
            responsive={false}
          >
            <TextIcon label={signOutLabel} iconType="signOut" />
          </StyledPopoverBox>
        </Box>
      )}
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
    <ModalRenderer slotId={modalSlotId}>
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
          <Box
            pad={{
              horizontal: 'small',
              bottom: 'small',
              top: mobileSignedOutView ? '1rem' : 'large',
            }}
          >
            <Box direction="row" justify="end" align="center">
              <Icon type="close" onClick={closePopover} primaryColor={true} />
            </Box>

            {renderProfileMenu()}
          </Box>
        </StyledOverlay>
      </ModalContainer>
    </ModalRenderer>
  );
  return <>{isMobileOnly ? renderProfileOverlay() : renderProfileDrop()} </>;
};

export { ProfileMenu };
