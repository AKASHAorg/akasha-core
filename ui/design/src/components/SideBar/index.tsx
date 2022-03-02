import * as React from 'react';
import { Accordion, Box, Text } from 'grommet';
import { IMenuItem, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import SectionTitle from './section-title';
import { MenuAppButton } from './menu-app-button';

import Icon from '../Icon';
import Button from '../Button';
import IconLink from '../IconLink';

import {
  StyledAppOptionBox,
  StyledHiddenScrollContainer,
  StyledMobileHRDiv,
  StyledAccordionPanel,
} from './styled-sidebar';

export interface ISidebarProps {
  worldAppsTitleLabel: string;
  userInstalledAppsTitleLabel: string;
  userInstalledApps: IMenuItem[];
  userInstalledWidgetsTitleLabel: string;
  userInstalledWidgets: IMenuItem[];
  exploreButtonLabel: string;
  bodyMenuItems: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  onClickMenuItem: (route: string) => void;
  // viewport size
  size?: string;
  className?: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    worldAppsTitleLabel,
    userInstalledAppsTitleLabel,
    userInstalledApps,
    userInstalledWidgetsTitleLabel,
    userInstalledWidgets,
    exploreButtonLabel,
    allMenuItems,
    bodyMenuItems,
    onClickMenuItem,
    currentRoute,
    size,
    className,
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

  const renderMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <StyledAccordionPanel
        size={size}
        key={index}
        onClick={handleAppIconClick(menuItem)}
        label={
          <Box margin={{ vertical: 'small' }} direction="row" align="center">
            <MenuAppButton menuItem={menuItem} active={active} plain={true} />
            <Text
              size="large"
              // add margin only for user-app and user-widget area
              margin={{
                ...((menuItem.area === MenuItemAreaType.UserAppArea ||
                  menuItem.area === MenuItemAreaType.UserWidgetArea) && { left: 'small' }),
              }}
            >
              {menuItem.label}
            </Text>
          </Box>
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <Box pad={{ horizontal: '1.125rem' }}>
            <StyledAppOptionBox direction="column" margin="small" justify="evenly" active={active}>
              {menuItem.subRoutes.map((subRouteMenuItem, idx) => (
                <IconLink
                  label={subRouteMenuItem.label}
                  key={idx}
                  onClick={handleOptionClick(menuItem, subRouteMenuItem)}
                  size="medium"
                  margin={{ horizontal: 'xsmall', top: idx === 0 ? 'none' : 'xxsmall' }}
                  active={subRouteMenuItem.route === activeOption?.route}
                />
              ))}
            </StyledAppOptionBox>
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
      <Box
        pad={{ top: 'medium', horizontal: 'medium' }}
        align="start"
        fill={true}
        border={{ size: '1px', style: 'solid', color: 'border', side: 'bottom' }}
      >
        <SectionTitle titleLabel={worldAppsTitleLabel} />
        <StyledHiddenScrollContainer>
          <Accordion multiple={true}>{bodyMenuItems?.map(renderMenuItem)}</Accordion>
        </StyledHiddenScrollContainer>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium' }}
        align="start"
        fill={true}
        border={{ size: '1px', color: 'border', side: 'bottom' }}
      >
        <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
        <StyledHiddenScrollContainer>
          <Accordion multiple={true}>{userInstalledApps?.map(renderMenuItem)}</Accordion>
        </StyledHiddenScrollContainer>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium' }}
        align="start"
        fill={true}
        border={{ size: '1px', color: 'border', side: 'bottom' }}
      >
        <SectionTitle titleLabel={userInstalledWidgetsTitleLabel} />
        <StyledHiddenScrollContainer>
          <Accordion multiple={true}>{userInstalledWidgets?.map(renderMenuItem)}</Accordion>
        </StyledHiddenScrollContainer>
      </Box>

      <StyledMobileHRDiv />

      <Box pad="small">
        <Button
          primary={true}
          size="large"
          height={2.5}
          label={
            <Box direction="row" justify="center">
              <Icon type="explore" plain={true} style={{ marginRight: '0.5rem' }} />
              {exploreButtonLabel}
            </Box>
          }
          onClick={() => {
            /* handle click */
          }}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;
