import { Box } from 'grommet';
import * as React from 'react';
import {
  SidebarBox,
  StyledFooter,
  StyledHiddenScrollContainer,
  StyledHRDiv,
  StyledHeader,
  StyledBorderBox,
  StyledVerticalPad,
} from './styled-sidebar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { MenuAppButton } from './menu-app-button';
import { SecondarySidebar } from './secondary-sidebar';

export interface ISidebarProps {
  loggedEthAddress: string;
  avatarImage?: string;
  headerMenuItems: IMenuItem[];
  bodyMenuItems: IMenuItem[];
  footerMenuItems: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  onClickMenuItem: (route: string) => void;
  onClickCloseSidebar: () => void;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    avatarImage,
    loggedEthAddress,
    allMenuItems,
    headerMenuItems,
    bodyMenuItems,
    footerMenuItems,
    onClickMenuItem,
    currentRoute,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | undefined>(undefined);
  const [activeOption, setActiveOption] = React.useState<IMenuItem | undefined>(undefined);

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
  const handleOptionClick = (menuItem: IMenuItem) => {
    setActiveOption(menuItem);
    onClickMenuItem(menuItem.route);
  };

  const renderMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <StyledVerticalPad key={index}>
        <StyledBorderBox fill="horizontal" align="center" userSection={true} active={active}>
          <MenuAppButton
            menuItem={menuItem}
            active={active}
            loggedEthAddress={loggedEthAddress}
            avatarImage={avatarImage}
            onClick={handleAppIconClick(menuItem)}
          />
        </StyledBorderBox>
      </StyledVerticalPad>
    );
  };

  return (
    <Box fill="vertical" direction="row">
      <SidebarBox
        direction="column"
        align="center"
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'right',
        }}
      >
        <StyledHeader align="center" direction="column" fill={true} pad={{ top: 'xxsmall' }}>
          {headerMenuItems?.map(renderMenuItem)}
        </StyledHeader>

        <StyledHRDiv />

        <Box align="center" justify="between" fill={true}>
          <StyledHiddenScrollContainer>
            {bodyMenuItems?.map(renderMenuItem)}
          </StyledHiddenScrollContainer>

          <StyledFooter>{footerMenuItems?.map(renderMenuItem)}</StyledFooter>
        </Box>
      </SidebarBox>
      <SecondarySidebar
        currentMenuItem={currentAppData}
        activeOption={activeOption}
        onOptionClick={handleOptionClick}
      />
    </Box>
  );
};

export { Sidebar };
