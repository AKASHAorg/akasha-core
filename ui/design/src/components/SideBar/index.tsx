import { Accordion, Box, Text } from 'grommet';
import * as React from 'react';
import IconLink from '../IconLink';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  StyledAppOptionBox,
  StyledHiddenScrollContainer,
  StyledMobileFooterBox,
  StyledMobileHRDiv,
  StyledText,
  StyledAccordionPanel,
} from './styled-sidebar';
import { MenuAppButton } from './menu-app-button';

export interface ISidebarProps {
  bodyMenuItems: IMenuItem[];
  footerMenuItems: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  onClickMenuItem: (route: string) => void;
  // viewport size
  size?: string;
  className?: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    allMenuItems,
    bodyMenuItems,
    footerMenuItems,
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

  const renderBodyMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <StyledAccordionPanel
        size={size}
        key={index}
        onClick={handleAppIconClick(menuItem)}
        label={
          <Box
            margin={{ vertical: 'small' }}
            pad={{ left: 'small' }}
            gap="xsmall"
            direction="row"
            align="center"
          >
            <MenuAppButton menuItem={menuItem} active={active} />
            <Text>{menuItem.label}</Text>
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
  const renderFooterMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <Box
        margin={{ vertical: 'small' }}
        pad={{ left: 'small' }}
        gap="xsmall"
        direction="row"
        align="center"
        key={index}
        onClick={handleAppIconClick(menuItem)}
      >
        <MenuAppButton menuItem={menuItem} active={active} />
        <StyledText>{menuItem.label}</StyledText>
      </Box>
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
      <Box align="center" fill={true}>
        <StyledHiddenScrollContainer>
          <Accordion multiple={true}>{bodyMenuItems?.map(renderBodyMenuItem)}</Accordion>
        </StyledHiddenScrollContainer>
      </Box>

      <StyledMobileHRDiv />

      <StyledMobileFooterBox>{footerMenuItems.map(renderFooterMenuItem)}</StyledMobileFooterBox>
    </Box>
  );
};

export default Sidebar;
