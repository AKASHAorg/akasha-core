import * as React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Box, Stack } from 'grommet';
import { IMenuItem, LogoTypeSource, IProfileData } from '@akashaorg/typings/ui';
import Icon from '../Icon';
import Avatar from '../Avatar';
import {
  TopbarWrapper,
  StyledText,
  StyledDrop,
  StyledDiv,
  StyledTextOnboarding,
  StyledAnchor,
  StyledContentBox,
  BrandIcon,
  MenuIcon,
  VersionButton,
  IconDiv,
  StyledSubWrapper,
} from './styled-topbar';
import { isMobileOnly } from 'react-device-detect';
import Button from '../Button';
import { ProfileMenu } from './profile-menu';

export interface ITopbarProps {
  // data
  loggedProfileData?: Partial<IProfileData>;
  versionURL?: string;
  hasNewNotifications?: boolean;
  quickAccessItems?: IMenuItem[];
  searchAreaItem?: IMenuItem;
  otherAreaItems?: IMenuItem[];
  currentLocation?: string;
  // labels
  brandLabel: string;
  versionLabel?: string;
  signInLabel?: string;
  signOutLabel?: string;
  legalLabel?: string;
  feedbackLabel?: string;
  feedbackInfoLabel?: string;
  legalCopyRightLabel?: string;
  stuckLabel?: string;
  helpLabel?: string;
  writeToUs?: string;
  // sidebar
  sidebarVisible: boolean;
  // handlers
  onNavigation: (path: string) => void;
  onSidebarToggle?: () => void;
  onFeedbackClick: () => void;
  // external css
  className?: string;
  onLoginClick: () => void;
  onLogout: () => void;
  onBrandClick?: () => void;
  onMyProfileClick: () => void;
  onLegalClick: (menuItem: IMenuItem) => void;
  modalSlotId: string;
}

const Topbar: React.FC<ITopbarProps> = props => {
  const {
    loggedProfileData,
    versionURL,
    currentLocation,
    brandLabel,
    versionLabel,
    signInLabel,
    signOutLabel,
    legalLabel,
    feedbackLabel,
    feedbackInfoLabel,
    legalCopyRightLabel,
    stuckLabel,
    helpLabel,
    writeToUs,
    className,
    quickAccessItems,
    otherAreaItems,
    sidebarVisible,
    onNavigation,
    onSidebarToggle,
    onLoginClick,
    onFeedbackClick,
    onLogout,
    hasNewNotifications,
    onBrandClick,
    modalSlotId,
  } = props;

  const [dropOpen, setDropOpen] = React.useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = React.useState(false);
  const [dropItems, setDropItems] = React.useState<IMenuItem[]>([]);
  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [legalMenu, setLegalMenu] = React.useState<IMenuItem | null>(null);

  const [currentDropItem, setCurrentDropItem] = React.useState<IMenuItem | null>(null);

  const menuItemRefs = React.useRef([]);
  const feedbackMenuRef = React.useRef(null);

  const mobileSignedOutView = isMobileOnly && !loggedProfileData?.ethAddress;
  const iconSize = isMobileOnly ? 'md' : 'sm';

  React.useEffect(() => {
    const legal = otherAreaItems?.find(menuItem => menuItem.name === '@akashaorg/app-legal');
    if (legal && legal.subRoutes?.length) {
      setLegalMenu(legal);
    }
  }, [otherAreaItems]);

  const handleNavigation = (menuItem: IMenuItem) => () => {
    if (onNavigation) {
      onNavigation(menuItem.route);
    }
    setDropOpen(false);
    setAvatarDropOpen(false);
  };

  const handleMenuClick = () => {
    setMenuDropOpen(true);
  };

  const onClickPluginButton = (menuItem: IMenuItem) => () => {
    setCurrentDropItem(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setDropItems(menuItem.subRoutes);
      setDropOpen(true);
    } else {
      onNavigation(menuItem.route);
    }
  };

  const onClickAvatarButton = (menuItem: IMenuItem) => () => {
    setCurrentDropItem(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setDropItems(menuItem.subRoutes);
      setAvatarDropOpen(true);
    } else {
      onNavigation(menuItem.route);
    }
  };

  const renderDrop = () => (
    <StyledDrop
      target={currentDropItem && menuItemRefs.current[currentDropItem?.index]}
      onClickOutside={() => {
        setDropOpen(false);
      }}
      onEsc={() => {
        setDropOpen(false);
      }}
      align={{ top: 'bottom', right: 'right' }}
    >
      <Box
        round="xxsmall"
        pad="xsmall"
        align="center"
        justify="start"
        gap="xsmall"
        border={{ style: 'solid', size: '1px', color: 'border', side: 'all' }}
      >
        {dropItems.map((menuItem: IMenuItem, index: number) => (
          <Box fill="horizontal" onClick={handleNavigation(menuItem)} key={index}>
            <StyledText>{menuItem.label}</StyledText>
          </Box>
        ))}
      </Box>
    </StyledDrop>
  );

  const renderPluginIcon = (menuItem: IMenuItem) => {
    if (menuItem.name === '@akashaorg/app-notifications') {
      return (
        <IconDiv
          onClick={onClickPluginButton(menuItem)}
          isActive={currentLocation?.includes(menuItem.route) || false}
          isMobile={isMobileOnly}
        >
          <Stack anchor="top-right">
            <Icon
              type={menuItem.logo?.value || 'app'}
              size={iconSize}
              clickable={true}
              accentColor={currentLocation?.includes(menuItem.route) || false}
            />
            {hasNewNotifications && (
              <Box background="errorText" width="9px" height="9px" round={true} />
            )}
          </Stack>
        </IconDiv>
      );
    }
    return (
      <IconDiv
        onClick={onClickPluginButton(menuItem)}
        isActive={currentLocation?.includes(menuItem.route) || false}
        isMobile={isMobileOnly}
      >
        <Icon
          type={menuItem.logo?.value || 'app'}
          size={iconSize}
          clickable={true}
          accentColor={currentLocation?.includes(menuItem.route) || false}
        />
      </IconDiv>
    );
  };

  const checkActiveAvatar = (menuItem: IMenuItem) => {
    if (menuItem.subRoutes?.length && currentLocation?.includes(menuItem?.subRoutes[0]?.route)) {
      return true;
    }
    return !!(loggedProfileData?.pubKey && currentLocation?.includes(loggedProfileData?.pubKey));
  };

  const renderPluginButton = (menuItem: IMenuItem, index: number) => {
    return (
      <StyledDiv
        key={index}
        ref={ref => {
          menuItemRefs.current[menuItem.index] = ref;
        }}
      >
        {menuItem.logo?.type === LogoTypeSource.AVATAR ? (
          <Avatar
            active={checkActiveAvatar(menuItem)}
            ethAddress={loggedProfileData?.ethAddress}
            src={loggedProfileData?.avatar}
            size="xs"
            onClick={onClickAvatarButton(menuItem)}
          />
        ) : (
          renderPluginIcon(menuItem)
        )}
      </StyledDiv>
    );
  };

  const renderContent = (shouldRenderOnboarding?: boolean) => {
    return (
      <StyledSubWrapper direction="row" align="center" height="3rem">
        <IconDiv
          margin={{ right: 'medium' }}
          isActive={sidebarVisible}
          size="2rem"
          onClick={onSidebarToggle}
        >
          <Icon type="menu" clickable={true} accentColor={sidebarVisible} />
        </IconDiv>
        <StyledContentBox
          direction="row"
          align="center"
          justify="between"
          fill="horizontal"
          height="3rem"
        >
          <Box
            direction="row"
            align="center"
            flex={{ shrink: 0 }}
            gap="small"
            onClick={onBrandClick}
          >
            <Box direction="row" gap="small" align="center">
              <BrandIcon type="akasha" clickable={true} plain={true} />
              {!isMobileOnly && (
                <StyledText style={{ userSelect: 'none' }} size="large" color="primaryText">
                  {brandLabel}
                </StyledText>
              )}
            </Box>
            {versionURL && (
              <VersionButton color="errorText" label={versionLabel} primary={true} size="small" />
            )}
          </Box>
          <Box
            direction="row"
            align="center"
            gap="small"
            pad={isMobileOnly ? 'none' : { left: 'medium' }}
            fill="horizontal"
            justify="end"
          >
            {loggedProfileData?.ethAddress &&
              !shouldRenderOnboarding &&
              quickAccessItems &&
              quickAccessItems.map(renderPluginButton)}
            {!isMobileOnly && !loggedProfileData?.ethAddress && !shouldRenderOnboarding && (
              <Box direction="row" align="center" gap="xsmall">
                <Button
                  onClick={onLoginClick}
                  label={signInLabel}
                  slimBorder={true}
                  primary
                  hoverIndicator="accentText"
                />
              </Box>
            )}
            {shouldRenderOnboarding && (
              <Box direction="row">
                <StyledTextOnboarding margin={{ right: '0.2rem' }} alignSelf="center">
                  {stuckLabel}
                </StyledTextOnboarding>
                <StyledAnchor href={writeToUs} label={helpLabel} target="_blank" />
              </Box>
            )}
            {(!loggedProfileData?.ethAddress || shouldRenderOnboarding) && (
              <IconDiv isActive={menuDropOpen} onClick={handleMenuClick} isMobile={isMobileOnly}>
                <MenuIcon
                  rotate={isMobileOnly ? 90 : 0}
                  ref={feedbackMenuRef}
                  type={isMobileOnly ? 'moreDark' : 'dropdown'}
                  clickable={true}
                  accentColor={menuDropOpen}
                  size={iconSize}
                />
              </IconDiv>
            )}
          </Box>
        </StyledContentBox>
      </StyledSubWrapper>
    );
  };

  const renderMobileSignedOutView = () => {
    if (!mobileSignedOutView) return null;
    return (
      <Box direction="row" align="center" gap="xsmall" fill="horizontal">
        <Button onClick={onLoginClick} label={signInLabel} fill="horizontal" />
      </Box>
    );
  };
  const handleMyProfileClick = () => {
    setDropOpen(false);
    props.onMyProfileClick();
  };
  const handleLegalClick = menuItem => () => {
    setDropOpen(false);
    props.onLegalClick(menuItem);
  };

  const renderLoggedInMenu = () => {
    if (avatarDropOpen && loggedProfileData?.ethAddress) {
      return (
        <ProfileMenu
          target={currentDropItem && menuItemRefs.current[currentDropItem?.index]}
          closePopover={() => setAvatarDropOpen(false)}
          onMyProfileButtonClick={handleMyProfileClick}
          onLegalClick={handleLegalClick}
          loggedProfileData={loggedProfileData}
          legalLabel={legalLabel}
          signOutLabel={signOutLabel}
          feedbackLabel={feedbackLabel}
          feedbackInfoLabel={feedbackInfoLabel}
          mobileSignedOutView={mobileSignedOutView}
          legalCopyRightLabel={legalCopyRightLabel}
          menuItems={dropItems}
          legalMenu={legalMenu}
          onLogout={onLogout}
          onFeedbackClick={onFeedbackClick}
          modalSlotId={modalSlotId}
        />
      );
    }
  };

  const renderLoggedOutMenu = () => {
    if (menuDropOpen && !loggedProfileData?.ethAddress) {
      return (
        <ProfileMenu
          target={feedbackMenuRef.current}
          closePopover={() => setMenuDropOpen(false)}
          onLegalClick={handleLegalClick}
          legalLabel={legalLabel}
          legalMenu={legalMenu}
          feedbackLabel={feedbackLabel}
          feedbackInfoLabel={feedbackInfoLabel}
          mobileSignedOutView={mobileSignedOutView}
          legalCopyRightLabel={legalCopyRightLabel}
          onFeedbackClick={onFeedbackClick}
          modalSlotId={modalSlotId}
        />
      );
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth-app/*"
          element={
            <TopbarWrapper
              align="center"
              justify="center"
              pad={{ vertical: 'small', horizontal: 'medium' }}
              fill="horizontal"
              className={className}
              elevation="shadow"
              height="3rem"
              border={{ side: 'bottom', size: '1px', style: 'solid', color: 'border' }}
            >
              {renderContent(true)}
              {dropOpen && renderDrop()}
              {renderLoggedOutMenu()}
            </TopbarWrapper>
          }
        />
        <Route
          path="*"
          element={
            <TopbarWrapper
              align="center"
              justify="center"
              pad={{ vertical: 'small', horizontal: 'medium' }}
              fill="horizontal"
              className={className}
              elevation="shadow"
              height={mobileSignedOutView ? '6rem' : '3rem'}
              border={{ side: 'bottom', size: '1px', style: 'solid', color: 'border' }}
            >
              {renderContent()}
              {renderMobileSignedOutView()}
              {dropOpen && renderDrop()}
              {renderLoggedInMenu()}
              {renderLoggedOutMenu()}
            </TopbarWrapper>
          }
        />
      </Routes>
    </Router>
  );
};

Topbar.defaultProps = {
  onNavigation: () => {
    return;
  },
  onBrandClick: () => {
    return;
  },
  signInLabel: 'Connect',
  signOutLabel: 'Sign Out',
  legalLabel: 'Legal',
  feedbackLabel: 'Send Us Feedback',
  feedbackInfoLabel: 'Help us improve the experience!',
};

export default Topbar;
