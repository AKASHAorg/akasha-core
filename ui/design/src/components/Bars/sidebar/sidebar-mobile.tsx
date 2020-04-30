import { Accordion, AccordionPanel, Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { Icon } from '../../Icon/index';
import { ISidebarProps } from './sidebar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  StyledAppOptionBox,
  StyledHiddenScrollContainer,
  StyledMobileFooterBox,
  StyledMobileHeaderBox,
  StyledMobileHRDiv,
} from './styled-sidebar';
import { MenuAppButton } from './menu-app-button';

const SidebarMobile: React.FC<ISidebarProps> = props => {
  const {
    loggedEthAddress,
    avatarImage,
    allMenuItems,
    headerMenuItems,
    bodyMenuItems,
    footerMenuItems,
    onClickMenuItem,
    onClickCloseSidebar,
    currentRoute,
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
  }, [currentRoute, allMenuItems]);

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    setCurrentAppData(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      // if the current app has subroutes, redirect to the first subroute
      setActiveOption(menuItem.subRoutes[0]);
      onClickMenuItem(menuItem.subRoutes[0].route);
    } else {
      onClickMenuItem(menuItem.route);
    }
  };
  const handleOptionClick = (menuItem: IMenuItem) => () => {
    setActiveOption(menuItem);
    onClickMenuItem(menuItem.route);
  };

  const renderMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <AccordionPanel
        key={index}
        onClick={handleAppIconClick(menuItem)}
        label={
          <Box
            margin={{ vertical: 'xsmall' }}
            pad={{ horizontal: 'small' }}
            border={{
              color: menuItem.label === currentAppData?.label ? 'accent' : 'background',
              size: '2px',
              side: 'left',
            }}
            gap="xsmall"
            direction="row"
            align="center"
          >
            <MenuAppButton
              menuItem={menuItem}
              active={active}
              loggedEthAddress={loggedEthAddress}
              avatarImage={avatarImage}
              onClick={handleAppIconClick(menuItem)}
            />
            <Text>{menuItem.label}</Text>
          </Box>
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <StyledAppOptionBox direction="column" pad={{ vertical: 'small', left: '1.75rem' }}>
            {menuItem.subRoutes.map(subRouteMenuItem => (
              <IconLink
                label={subRouteMenuItem.label}
                key={subRouteMenuItem.index}
                onClick={handleOptionClick(subRouteMenuItem)}
                size="medium"
                margin={{ vertical: 'xsmall' }}
                active={subRouteMenuItem.route === activeOption?.route}
              />
            ))}
          </StyledAppOptionBox>
        )}
      </AccordionPanel>
    );
  };

  return (
    <Box fill={true} direction="column">
      <StyledMobileHeaderBox>
        <Box align="end" pad="xxsmall">
          <Icon type="close" primaryColor={true} onClick={onClickCloseSidebar} clickable={true} />
        </Box>
        <StyledHiddenScrollContainer>
          <Box pad={{ bottom: 'xsmall' }}>
            <Accordion>{headerMenuItems.map(renderMenuItem)}</Accordion>
          </Box>
        </StyledHiddenScrollContainer>
      </StyledMobileHeaderBox>

      <StyledMobileHRDiv />

      <Box align="center" fill={true}>
        <StyledHiddenScrollContainer>
          <Accordion>{bodyMenuItems?.map(renderMenuItem)}</Accordion>
        </StyledHiddenScrollContainer>
      </Box>

      <StyledMobileHRDiv />

      <StyledMobileFooterBox>
        <Accordion>{footerMenuItems.map(renderMenuItem)}</Accordion>
      </StyledMobileFooterBox>
    </Box>
  );
};

export { SidebarMobile };
