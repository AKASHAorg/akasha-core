import * as React from 'react';
import { Accordion, Box, Text } from 'grommet';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { MenuAppButton } from './menu-app-button';
import SectionTitle from './section-title';
import Skeleton from './skeleton';

import Icon from '../Icon';

import {
  StyledHiddenScrollContainer,
  StyledMobileHRDiv,
  StyledAccordionPanel,
} from './styled-sidebar';

export interface ISidebarProps {
  worldAppsTitleLabel: string;
  poweredByLabel: string;
  userInstalledAppsTitleLabel: string;
  userInstalledApps: IMenuItem[];
  exploreButtonLabel: string;
  bodyMenuItems: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  isLoggedIn: boolean;
  loadingUserInstalledApps: boolean;
  onClickMenuItem: (route: string) => void;
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
    bodyMenuItems,
    currentRoute,
    isLoggedIn,
    loadingUserInstalledApps,
    size,
    className,
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

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      // if the current app has no subroutes, set as active and redirect to its route
      setCurrentAppData(menuItem);
      setActiveOption(null);
      onClickMenuItem(menuItem.route);
    }
  };
  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => () => {
    setCurrentAppData(menuItem);
    setActiveOption(subrouteMenuItem);
    onClickMenuItem(subrouteMenuItem.route);
  };

  const handleExploreClick = () => {
    onClickExplore();
  };

  const renderMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <StyledAccordionPanel
        size={size}
        key={index}
        hasChevron={menuItem.subRoutes?.length > 0}
        onClick={handleAppIconClick(menuItem)}
        label={
          <Box margin={{ vertical: 'small' }} direction="row" align="center">
            <MenuAppButton menuItem={menuItem} active={active} plain={true} />
            <Text size="large" margin={{ left: 'small' }}>
              {menuItem.label}
            </Text>
          </Box>
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <Box pad={{ horizontal: '1.125rem' }}>
            <Box direction="column" justify="evenly">
              {menuItem.subRoutes.map((subRouteMenuItem, idx) => (
                <Box
                  key={idx + subRouteMenuItem.label}
                  pad={{ vertical: 'large', left: 'large' }}
                  border={{
                    size: 'medium',
                    color: subRouteMenuItem.route === activeOption?.route ? 'accent' : 'border',
                    side: 'left',
                  }}
                  onClick={handleOptionClick(menuItem, subRouteMenuItem)}
                >
                  <Text size="large">{subRouteMenuItem.label}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </StyledAccordionPanel>
    );
  };

  return (
    <Box
      fill={true}
      direction="column"
      elevation="shadow"
      border={{ size: '1px', style: 'solid', color: 'border', side: 'right' }}
      className={className}
    >
      <StyledHiddenScrollContainer>
        {bodyMenuItems?.length > 0 && (
          <Box
            pad={{ top: 'medium', bottom: 'small', horizontal: 'medium' }}
            align="start"
            fill={true}
          >
            <SectionTitle titleLabel={worldAppsTitleLabel} subtitleLabel={poweredByLabel} />
            <Accordion multiple={true} fill={true}>
              {bodyMenuItems?.map(renderMenuItem)}
            </Accordion>
          </Box>
        )}
        {isLoggedIn && loadingUserInstalledApps && (
          <Box
            pad={{ top: 'medium', bottom: 'small', horizontal: 'medium' }}
            align="start"
            fill={true}
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Skeleton count={5} />
          </Box>
        )}
        {isLoggedIn && userInstalledApps?.length > 0 && (
          <Box
            pad={{ top: 'medium', bottom: 'small', horizontal: 'medium' }}
            align="start"
            fill={true}
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Accordion multiple={true} fill={true}>
              {userInstalledApps?.map(renderMenuItem)}
            </Accordion>
          </Box>
        )}
      </StyledHiddenScrollContainer>

      <StyledMobileHRDiv />

      {isLoggedIn && (
        <Box direction="row" pad="small" align="center" onClick={handleExploreClick}>
          <Icon type="explore" size="md" plain={true} style={{ marginRight: '0.75rem' }} />
          <Text color="accentText" size="large">
            {exploreButtonLabel}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
