import { Accordion, AccordionPanel, Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import { TextIcon } from '../../TextIcon/index';
import { ISidebarProps } from './sidebar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  StyledAppIconWrapper,
  StyledAppOptionBox,
  StyledHiddenScrollContainer,
  StyledMobileFooterBox,
  StyledMobileHeaderBox,
} from './styled-sidebar';

const SidebarMobile: React.FC<ISidebarProps> = props => {
  const {
    allMenuItems,
    onClickMenuItem,
    onClickCloseSidebar,
    appCenterLabel,
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
      if (splitUrl[2] && currentRoute !== activeOption?.route && currentAppData) {
        const currentOption = currentAppData?.subRoutes?.find(
          menuItem => menuItem.route === currentRoute,
        );
        if (currentOption) {
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

  return (
    <Box fill={true} direction="column">
      <StyledMobileHeaderBox
        margin={{ horizontal: 'small' }}
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'bottom',
        }}
      >
        <Box align="end" pad={{ vertical: 'xsmall' }}>
          <Icon type="close" primaryColor={true} onClick={onClickCloseSidebar} clickable={true} />
        </Box>
        {/* <Box align="start" pad={{ bottom: 'xsmall' }}>
          <TextIcon
            label={searchLabel}
            iconType="search"
            clickable={true}
            onClick={onClickSearch}
          />
        </Box> */}
      </StyledMobileHeaderBox>
      <Box align="center" fill={true}>
        <StyledHiddenScrollContainer>
          <Accordion>
            {allMenuItems?.map(menuItem => (
              <AccordionPanel
                onClick={handleAppIconClick(menuItem)}
                label={
                  <Box
                    pad={{ horizontal: 'small' }}
                    margin={{ vertical: 'xsmall' }}
                    border={{
                      color: menuItem.index === currentAppData?.index ? 'accent' : 'background',
                      size: '2px',
                      side: 'left',
                    }}
                    gap="xsmall"
                    direction="row"
                    align="center"
                  >
                    <StyledAppIconWrapper active={menuItem.index === currentAppData?.index}>
                      <AppIcon placeholderIconType="app" appImg={menuItem.logo} size="md" />
                    </StyledAppIconWrapper>
                    <Text>{menuItem.label}</Text>
                  </Box>
                }
                key={menuItem.index}
              >
                {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
                  <StyledAppOptionBox
                    direction="column"
                    pad={{ vertical: 'small', left: '1.75em' }}
                  >
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
            ))}
          </Accordion>
        </StyledHiddenScrollContainer>
      </Box>
      <StyledMobileFooterBox
        margin={{ horizontal: 'small' }}
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'top',
        }}
        justify="center"
      >
        <Box justify="start" pad={{ vertical: 'small' }}>
          <TextIcon label={appCenterLabel} iconType="plusGrey" size="md" />
        </Box>
      </StyledMobileFooterBox>
    </Box>
  );
};

export { SidebarMobile };
