import * as React from 'react';
import { Box, Text } from 'grommet';

import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import Skeleton from './skeleton';
import SectionTitle from './section-title';
import SidebarMenuItem from './sidebar-menu-item';

import Icon from '../Icon';

import {
  StyledHiddenScrollContainer,
  StyledSubWrapper,
  StyledButton,
  StyledFooter,
  StyledAccordion,
} from './styled-sidebar';
import { IconDiv, BrandIcon, VersionButton } from '../TopBar/styled-topbar';

export interface ISidebarProps {
  worldAppsTitleLabel: string;
  poweredByLabel: string;
  userInstalledAppsTitleLabel: string;
  userInstalledApps: IMenuItem[];
  exploreButtonLabel: string;
  worldApps: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  isLoggedIn: boolean;
  hasNewNotifs?: boolean;
  loadingUserInstalledApps: boolean;
  versionURL?: string;
  versionLabel?: string;
  // handlers
  onBrandClick?: () => void;
  onSidebarClose: () => void;
  onClickMenuItem: (appName: string, route: string) => void;
  onClickExplore: () => void;
  // viewport size
  size?: string;
  className?: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    worldAppsTitleLabel,
    poweredByLabel,
    userInstalledAppsTitleLabel,
    userInstalledApps,
    exploreButtonLabel,
    allMenuItems,
    worldApps,
    currentRoute,
    isLoggedIn,
    hasNewNotifs,
    loadingUserInstalledApps,
    versionURL,
    versionLabel,
    size,
    className,
    onBrandClick,
    onSidebarClose,
    onClickMenuItem,
    onClickExplore,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);
  const [activeOption, setActiveOption] = React.useState<IMenuItem | null>(null);

  React.useEffect(() => {
    if (allMenuItems && currentRoute) {
      const splitUrl = currentRoute.split('/');
      const route = splitUrl[1] ? `/${splitUrl[1]}` : '/';

      const activeApp = allMenuItems.find(menuItem => menuItem.route === route);
      if (activeApp && activeApp.index !== currentAppData?.index) {
        setCurrentAppData(activeApp);
      }

      // set the subroute
      if (splitUrl[2] && currentRoute !== activeOption?.route) {
        const currentOption = activeApp?.subRoutes?.find(
          menuItem => menuItem.route === currentRoute,
        );
        if (currentOption && currentOption.index !== activeOption?.index) {
          setActiveOption(currentOption);
        }
      }
    }
  }, [currentRoute, allMenuItems, currentAppData, activeOption]);

  const handleAppIconClick = (menuItem: IMenuItem, isMobile?: boolean) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      // if the current app has no subroutes, set as active and redirect to its route
      setCurrentAppData(menuItem);
      setActiveOption(null);
      onClickMenuItem(menuItem.name, menuItem.route);
      if (isMobile) {
        onSidebarClose();
      }
    }
  };
  const handleOptionClick = (
    menuItem: IMenuItem,
    subrouteMenuItem: IMenuItem,
    isMobile?: boolean,
  ) => {
    setCurrentAppData(menuItem);
    setActiveOption(subrouteMenuItem);
    onClickMenuItem(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      onSidebarClose();
    }
  };

  const handleExploreClick = () => {
    onClickExplore();
  };

  return (
    <Box
      direction="column"
      elevation="shadow"
      className={className}
      style={{ position: 'relative' }}
      border={{ side: 'right', size: 'xsmall', color: 'border' }}
    >
      <StyledHiddenScrollContainer>
        <Box pad={{ bottom: 'small' }} align="start">
          <StyledSubWrapper
            // dynamically setting margin to match topbar border visible under overlay
            margin={{ ...(!isLoggedIn && { top: 'small' }) }}
            pad={{ horizontal: 'medium' }}
          >
            <IconDiv margin={{ right: 'medium' }} isActive={true} onClick={onSidebarClose}>
              <Icon type="menu" clickable={true} accentColor={true} />
            </IconDiv>
            <Box
              direction="row"
              align="center"
              flex={{ shrink: 0 }}
              gap="small"
              onClick={onBrandClick}
            >
              <Box direction="row" gap="small" align="center">
                <BrandIcon type="ethereumWorldLogo" clickable={true} plain={true} />
              </Box>
              {versionURL && (
                <VersionButton color="errorText" label={versionLabel} primary={true} size="small" />
              )}
            </Box>
          </StyledSubWrapper>
          <SectionTitle titleLabel={worldAppsTitleLabel} subtitleLabel={poweredByLabel} />
          <StyledAccordion>
            {worldApps &&
              worldApps.map((menuItem: IMenuItem, index: number) => (
                <SidebarMenuItem
                  key={`${menuItem.name}-${index}`}
                  menuItem={menuItem}
                  index={index}
                  currentRoute={currentRoute}
                  onMenuItemClick={handleAppIconClick}
                  onSubMenuItemClick={handleOptionClick}
                  size={size}
                  activeOption={activeOption}
                />
              ))}
          </StyledAccordion>
        </Box>
        {isLoggedIn && loadingUserInstalledApps && (
          <Box
            pad={{ bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Skeleton count={5} />
          </Box>
        )}
        {isLoggedIn && userInstalledApps?.length > 0 && (
          <Box
            pad={{ bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <StyledAccordion>
              {userInstalledApps?.map((menuItem: IMenuItem, index: number) => (
                <SidebarMenuItem
                  key={`${menuItem.name}-${index}`}
                  menuItem={menuItem}
                  index={index}
                  currentRoute={currentRoute}
                  onMenuItemClick={handleAppIconClick}
                  onSubMenuItemClick={handleOptionClick}
                  size={size}
                  activeOption={activeOption}
                  hasNewNotifs={hasNewNotifs}
                />
              ))}
            </StyledAccordion>
          </Box>
        )}
      </StyledHiddenScrollContainer>

      {isLoggedIn && (
        <StyledFooter>
          <StyledButton
            margin="small"
            label={
              <Box direction="row" align="center" justify="center" margin={{ vertical: ' xlarge' }}>
                <Icon type="explore" size="xs" plain={true} style={{ marginRight: '0.75rem' }} />
                <Text color="accentText" size="large">
                  {exploreButtonLabel}
                </Text>
              </Box>
            }
            onClick={handleExploreClick}
          />
        </StyledFooter>
      )}
    </Box>
  );
};

export default Sidebar;
