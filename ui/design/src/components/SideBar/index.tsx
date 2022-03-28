import * as React from 'react';
import { Box, Text } from 'grommet';

import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';
import SectionTitle from './section-title';
import Skeleton from './skeleton';

import Icon from '../Icon';

import {
  StyledHiddenScrollContainer,
  StyledButton,
  StyledFooter,
  StyledAccordion,
  MobileAccordionPanel,
  DesktopAccordionPanel,
} from './styled-sidebar';

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
  loadingUserInstalledApps: boolean;
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
    loadingUserInstalledApps,
    size,
    className,
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

  const handleAppIconClick = (menuItem: IMenuItem, isMobile?: boolean) => () => {
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

  const renderMenuItem = (menuItem: IMenuItem, index?: number) => {
    const activePanel = !!currentRoute?.match(menuItem?.route);
    return (
      <>
        <DesktopAccordionPanel
          size={size}
          key={index + menuItem.label}
          hasChevron={menuItem.subRoutes?.length > 0}
          onClick={handleAppIconClick(menuItem)}
          isActive={activePanel}
          label={<MenuItemLabel menuItem={menuItem} />}
        >
          {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
            <MenuSubItems
              isMobile={false}
              menuItem={menuItem}
              activeOption={activeOption}
              onOptionClick={handleOptionClick}
            />
          )}
        </DesktopAccordionPanel>
        <MobileAccordionPanel
          size={size}
          key={menuItem.index}
          hasChevron={menuItem.subRoutes?.length > 0}
          onClick={handleAppIconClick(menuItem, true)}
          isActive={activePanel}
          label={<MenuItemLabel menuItem={menuItem} />}
        >
          {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
            <MenuSubItems
              isMobile={true}
              menuItem={menuItem}
              activeOption={activeOption}
              onOptionClick={(menu, subMenu) => handleOptionClick(menu, subMenu, true)}
            />
          )}
        </MobileAccordionPanel>
      </>
    );
  };

  return (
    <Box
      direction="column"
      elevation="shadow"
      className={className}
      style={{ position: 'relative' }}
    >
      <StyledHiddenScrollContainer>
        {worldApps?.length > 0 && (
          <Box pad={{ top: 'medium', bottom: 'small' }} align="start">
            <SectionTitle titleLabel={worldAppsTitleLabel} subtitleLabel={poweredByLabel} />
            <StyledAccordion>
              {worldApps?.map((app: IMenuItem, index: number) => (
                <React.Fragment key={index}>{renderMenuItem(app, index)}</React.Fragment>
              ))}
            </StyledAccordion>
          </Box>
        )}
        {isLoggedIn && loadingUserInstalledApps && (
          <Box
            pad={{ top: 'medium', bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Skeleton count={5} />
          </Box>
        )}
        {isLoggedIn && userInstalledApps?.length > 0 && (
          <Box
            pad={{ top: 'medium', bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <StyledAccordion>
              {userInstalledApps?.map((app: IMenuItem, index: number) => (
                <React.Fragment key={index}>{renderMenuItem(app, index)}</React.Fragment>
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
                <Icon type="explore" size="md" plain={true} style={{ marginRight: '0.75rem' }} />
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
