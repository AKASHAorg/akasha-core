import { Box, Stack } from 'grommet';
import * as React from 'react';
import Icon from '../Icon';
import { SearchBar } from './search-bar';
import { MobileSearchBar } from './mobile-search-bar';
import Avatar from '../Avatar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings/lib/';
import {
  TopbarWrapper,
  StyledText,
  StyledSearchContainer,
  StyledDrop,
  StyledDiv,
  StyledContentBox,
  BrandIcon,
  MenuIcon,
  VersionButton,
  IconDiv,
} from './styled-topbar';
import { isMobileOnly } from 'react-device-detect';
import Button from '../Button';
import { IProfileData } from '../ProfileCard/profile-widget-card';
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
  signUpLabel?: string;
  signOutLabel?: string;
  searchBarLabel?: string;
  legalLabel?: string;
  feedbackLabel?: string;
  feedbackInfoLabel?: string;
  moderationLabel?: string;
  moderationInfoLabel?: string;
  legalCopyRightLabel?: string;
  // moderator tools
  isModerator?: boolean;
  dashboardLabel?: string;
  dashboardInfoLabel?: string;
  // handlers
  onNavigation: (path: string) => void;
  onSidebarToggle?: (visibility: boolean) => void;
  onSearch: (inputValue: string) => void;
  onFeedbackClick: () => void;
  onModerationClick: () => void;
  onDashboardClick: () => void;
  // external css
  className?: string;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogout: () => void;
  onBrandClick?: () => void;
}

const Topbar: React.FC<ITopbarProps> = props => {
  const {
    loggedProfileData,
    versionURL,
    currentLocation,
    brandLabel,
    versionLabel,
    signInLabel,
    signUpLabel,
    signOutLabel,
    searchBarLabel,
    legalLabel,
    feedbackLabel,
    feedbackInfoLabel,
    moderationLabel,
    moderationInfoLabel,
    legalCopyRightLabel,
    isModerator,
    dashboardLabel,
    dashboardInfoLabel,
    className,
    quickAccessItems,
    searchAreaItem,
    otherAreaItems,
    onSearch,
    onNavigation,
    // onSidebarToggle,
    onLoginClick,
    onSignUpClick,
    onFeedbackClick,
    onModerationClick,
    onDashboardClick,
    onLogout,
    hasNewNotifications,
    onBrandClick,
  } = props;

  const [inputValue, setInputValue] = React.useState('');
  // const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [dropOpen, setDropOpen] = React.useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = React.useState(false);
  const [dropItems, setDropItems] = React.useState<IMenuItem[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [legalMenu, setLegalMenu] = React.useState<IMenuItem | null>(null);

  const [currentDropItem, setCurrentDropItem] = React.useState<IMenuItem | null>(null);

  const menuItemRefs = React.useRef([]);
  const feedbackMenuRef = React.useRef(null);

  const mobileSignedOutView = isMobileOnly && !loggedProfileData?.ethAddress;
  const iconSize = isMobileOnly ? 'md' : 'sm';

  React.useEffect(() => {
    const legal = otherAreaItems?.find(menuItem => menuItem.name === 'ui-plugin-legal');
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

  // const handleSidebarVisibility = () => {
  //   if (!sidebarOpen && onSidebarToggle) {
  //     onSidebarToggle(true);
  //     setSidebarOpen(true);
  //   } else if (sidebarOpen && onSidebarToggle) {
  //     onSidebarToggle(false);
  //     setSidebarOpen(false);
  //   }
  // };

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
    if (menuItem.name === 'ui-plugin-notifications') {
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
    if (loggedProfileData?.pubKey && currentLocation?.includes(loggedProfileData?.pubKey)) {
      return true;
    }
    return false;
  };

  const renderPluginButton = (menuItem: IMenuItem, index: number) => (
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

  const renderSearchArea = () => {
    if (searchAreaItem) {
      if (isMobileOnly) {
        return (
          <Icon
            type="search"
            size={iconSize}
            onClick={() => {
              setMobileSearchOpen(true);
            }}
          />
        );
      }
      return (
        <StyledSearchContainer>
          <SearchBar
            inputValue={inputValue}
            onInputChange={ev => setInputValue(ev.target.value)}
            onSearch={onSearch}
            inputPlaceholderLabel={searchBarLabel}
          />
        </StyledSearchContainer>
      );
    }
    return;
  };

  const renderContent = () => {
    if (isMobileOnly && mobileSearchOpen) {
      return (
        <MobileSearchBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSearch={onSearch}
          inputPlaceholderLabel={searchBarLabel}
          handleCloseInput={() => {
            if (currentLocation?.includes('search')) {
              history.back();
            }
            setInputValue('');
            setMobileSearchOpen(false);
          }}
        />
      );
    }
    return (
      <StyledContentBox
        direction="row"
        align="center"
        justify="between"
        fill="horizontal"
        height="3rem"
      >
        <Box direction="row" align="center" flex={{ shrink: 0 }} gap="small" onClick={onBrandClick}>
          <Box direction="row" gap="small" align="center">
            <BrandIcon type="ethereumWorldLogo" clickable={true} />
            {!isMobileOnly && (
              <StyledText style={{ userSelect: 'none' }} size="large">
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
          {renderSearchArea()}
          {props.children}
          {loggedProfileData?.ethAddress &&
            quickAccessItems &&
            quickAccessItems.map(renderPluginButton)}
          {!isMobileOnly && !loggedProfileData?.ethAddress && (
            <Box direction="row" align="center" gap="small">
              <Button onClick={onLoginClick} label={signInLabel} />
              <Button primary={true} onClick={onSignUpClick} label={signUpLabel} />
            </Box>
          )}
          {!loggedProfileData?.ethAddress && (
            <IconDiv isActive={menuDropOpen} onClick={handleMenuClick} isMobile={isMobileOnly}>
              <MenuIcon
                rotate={isMobileOnly ? 90 : 0}
                ref={feedbackMenuRef}
                type={isMobileOnly ? 'moreDark' : 'arrowDown'}
                clickable={true}
                accentColor={menuDropOpen}
                size={iconSize}
              />
            </IconDiv>
          )}
        </Box>
      </StyledContentBox>
    );
  };

  return (
    <TopbarWrapper
      align="center"
      pad={{ vertical: 'small', horizontal: 'medium' }}
      fill="horizontal"
      className={className}
      elevation="shadow"
      height={mobileSignedOutView ? '6rem' : '3rem'}
      border={{ side: 'bottom', size: '1px', style: 'solid', color: 'border' }}
    >
      {renderContent()}
      {mobileSignedOutView && (
        <Box direction="row" align="center" gap="small" fill="horizontal">
          <Button onClick={onLoginClick} label={signInLabel} fill="horizontal" />
          <Button primary={true} onClick={onSignUpClick} label={signUpLabel} fill="horizontal" />
        </Box>
      )}
      {dropOpen && renderDrop()}
      {avatarDropOpen && loggedProfileData?.ethAddress && (
        <ProfileMenu
          target={currentDropItem && menuItemRefs.current[currentDropItem?.index]}
          closePopover={() => setAvatarDropOpen(false)}
          onNavigation={onNavigation}
          loggedProfileData={loggedProfileData}
          legalLabel={legalLabel}
          signOutLabel={signOutLabel}
          isModerator={isModerator}
          dashboardLabel={dashboardLabel}
          dashboardInfoLabel={dashboardInfoLabel}
          feedbackLabel={feedbackLabel}
          feedbackInfoLabel={feedbackInfoLabel}
          moderationLabel={moderationLabel}
          moderationInfoLabel={moderationInfoLabel}
          mobileSignedOutView={mobileSignedOutView}
          legalCopyRightLabel={legalCopyRightLabel}
          menuItems={dropItems}
          legalMenu={legalMenu}
          onLogout={onLogout}
          onFeedbackClick={onFeedbackClick}
          onModerationClick={onModerationClick}
          onDashboardClick={onDashboardClick}
        />
      )}
      {menuDropOpen && !loggedProfileData?.ethAddress && (
        <ProfileMenu
          target={feedbackMenuRef.current}
          closePopover={() => setMenuDropOpen(false)}
          onNavigation={onNavigation}
          legalLabel={legalLabel}
          legalMenu={legalMenu}
          isModerator={isModerator}
          dashboardLabel={dashboardLabel}
          dashboardInfoLabel={dashboardInfoLabel}
          feedbackLabel={feedbackLabel}
          feedbackInfoLabel={feedbackInfoLabel}
          moderationLabel={moderationLabel}
          moderationInfoLabel={moderationInfoLabel}
          mobileSignedOutView={mobileSignedOutView}
          legalCopyRightLabel={legalCopyRightLabel}
          onFeedbackClick={onFeedbackClick}
          onModerationClick={onModerationClick}
          onDashboardClick={onDashboardClick}
        />
      )}
    </TopbarWrapper>
  );
};

Topbar.defaultProps = {
  onNavigation: () => {
    return;
  },
  onBrandClick: () => {
    return;
  },
  signUpLabel: 'Sign Up',
  signInLabel: 'Sign In',
  signOutLabel: 'Sign Out',
  legalLabel: 'Legal',
  feedbackLabel: 'Send Us Feedback',
  feedbackInfoLabel: 'Help us improve the experience!',
  moderationLabel: 'Moderation History',
  moderationInfoLabel: 'Help keep us accountable!',
};

export default Topbar;
