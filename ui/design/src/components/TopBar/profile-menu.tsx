import { IMenuItem } from '@akashaorg/typings/ui';
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
import { Profile } from '@akashaorg/typings/ui';

export interface IProfileMenu {
  loggedProfileData?: Profile;
  menuItems?: IMenuItem[];
  legalMenu: IMenuItem | null;
  target: HTMLElement;
  // labels
  legalLabel?: string;
  signOutLabel?: string;
  feedbackLabel?: string;
  feedbackInfoLabel?: string;
  mobileSignedOutView?: boolean;
  legalCopyRightLabel?: string;
  // handlers
  closePopover: () => void;
  // onNavigation: (path: string) => void;
  onFeedbackClick: () => void;
  onMyProfileButtonClick?: () => void;
  onLegalClick: (menuItem: IMenuItem) => () => void;
  onLogout?: () => void;
  modalSlotId: string;
  children?: React.ReactNode;
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
    mobileSignedOutView,
    legalCopyRightLabel,
    closePopover,
    // onNavigation,
    onFeedbackClick,
    onLogout,
    modalSlotId,
    onMyProfileButtonClick = () => {
      return;
    },
    onLegalClick,
  } = props;

  // const handleNavigation = (menuItem: IMenuItem) => () => {
  //   if (onNavigation) {
  //     onNavigation(menuItem.route);
  //   }
  //   closePopover();
  // };

  const handleFeedbackClick = () => {
    if (onFeedbackClick) {
      onFeedbackClick();
    }
    closePopover();
  };

  const renderAvatarMenuItem = (menuItem: IMenuItem) => {
    if (menuItem.label.replace(/\s*/g, '').match(/myprofile/i)) {
      return (
        <>
          <Box
            border={{ style: 'solid', size: '1px', color: 'border', side: 'bottom' }}
            justify="start"
          >
            <StyledPopoverBox pad="xsmall" margin={{ vertical: 'xsmall' }} responsive={false}>
              <ProfileAvatarButton
                profileId={loggedProfileData?.did.id}
                avatarImage={loggedProfileData?.avatar}
                label={loggedProfileData?.name}
                info={loggedProfileData?.name}
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
  ];

  const renderProfileMenu = () => (
    <Box pad="xsmall" direction="column" align="center">
      {loggedProfileData?.did.id &&
        menuItems?.map((menuItem: IMenuItem, index: number) => (
          <Box fill="horizontal" onClick={onMyProfileButtonClick} key={index}>
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
                iconSize={'sm'}
              />
            </StyledPopoverBox>
          </Box>
        );
      })}
      <Box
        border={
          loggedProfileData?.did.id
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
                onClick={onLegalClick(menuItem)}
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
      {loggedProfileData?.did.id && onLogout && (
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
              <Icon type="close" onClick={closePopover} />
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
