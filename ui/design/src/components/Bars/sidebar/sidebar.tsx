import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import {
  SecondarySidebarBox,
  SecondarySidebarContentWrapper,
  SidebarBox,
  StyledAppIconWrapper,
  StyledBorderBox,
  StyledBottomDiv,
  StyledHiddenScrollContainer,
  StyledHRDiv,
  StyledUserSectionBox,
  StyledVerticalPad,
} from './styled-sidebar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

export interface ISidebarProps {
  loggedEthAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  installedApps?: IMenuItem[];
  profilePluginData?: IMenuItem;
  currentRoute?: string;
  onClickMenuItem: (route: string) => void;
  onClickAddApp: () => void;
  onClickSearch: () => void;
  onClickCloseSidebar: () => void;
  searchLabel: string;
  appCenterLabel: string;
}

export interface IApp {
  name: string;
  image?: string;
  ethAddress: string;
  options: string[];
}

export interface INotification {
  ethAddress: string;
  user?: string;
  userAvatar?: string;
  time: string;
  action: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    avatarImage,
    loggedEthAddress,
    // notifications,
    installedApps,
    profilePluginData,
    onClickAddApp,
    onClickMenuItem,
    onClickSearch,
    currentRoute,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);
  const [activeOption, setActiveOption] = React.useState<IMenuItem | null>(null);

  React.useEffect(() => {
    if (installedApps && currentRoute) {
      const splitUrl = currentRoute.split('/');
      const route = splitUrl[1] ? `/${splitUrl[1]}` : '/';
      // check if route corresponds to profile app or one of the installed apps
      if (
        profilePluginData &&
        `/${splitUrl[1]}` === profilePluginData.route &&
        currentAppData?.index !== profilePluginData.index
      ) {
        setCurrentAppData(profilePluginData);
      } else {
        const activeApp = installedApps.find(menuItem => menuItem.route === route);
        if (activeApp && activeApp.index !== currentAppData?.index) {
          setCurrentAppData(activeApp);
        }
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
  }, [currentRoute, profilePluginData, installedApps]);

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

  const noop = () => {
    return;
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
        <StyledUserSectionBox
          align="center"
          direction="column"
          fill={true}
          pad={{ top: 'xxsmall' }}
        >
          <StyledVerticalPad>
            <StyledBorderBox
              fill="horizontal"
              align="center"
              userSection={true}
              active={profilePluginData ? currentAppData?.label === profilePluginData.label : false}
            >
              <StyledAppIconWrapper
                active={
                  profilePluginData ? currentAppData?.label === profilePluginData.label : false
                }
              >
                <Avatar
                  ethAddress={loggedEthAddress}
                  src={avatarImage}
                  size="sm"
                  onClick={profilePluginData ? handleAppIconClick(profilePluginData) : noop}
                />
              </StyledAppIconWrapper>
            </StyledBorderBox>
          </StyledVerticalPad>

          <StyledVerticalPad>
            <Icon type="notifications" clickable={true} />
          </StyledVerticalPad>
          <StyledVerticalPad>
            <Icon type="search" clickable={true} onClick={onClickSearch} />
          </StyledVerticalPad>
        </StyledUserSectionBox>
        <StyledHRDiv />
        <Box align="center" justify="between" fill={true}>
          <StyledHiddenScrollContainer>
            {installedApps?.map((app, index) => (
              <StyledVerticalPad key={index}>
                <StyledBorderBox
                  fill="horizontal"
                  align="center"
                  active={app.index === currentAppData?.index}
                >
                  <StyledAppIconWrapper active={app.index === currentAppData?.index}>
                    <AppIcon
                      placeholderIconType="app"
                      appImg={app.logo}
                      onClick={handleAppIconClick(app)}
                      size="md"
                    />
                  </StyledAppIconWrapper>
                </StyledBorderBox>
              </StyledVerticalPad>
            ))}
          </StyledHiddenScrollContainer>

          <StyledBottomDiv>
            <Icon type="plusGrey" onClick={onClickAddApp} clickable={true} size="md" />
          </StyledBottomDiv>
        </Box>
      </SidebarBox>
      <SecondarySidebarBox
        fill="vertical"
        direction="column"
        align="center"
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'right',
        }}
      >
        <SecondarySidebarContentWrapper>
          <Box
            pad={{ vertical: 'small', horizontal: 'none' }}
            fill="horizontal"
            border={{ color: 'border', size: '1px', side: 'bottom' }}
            gap="xsmall"
            direction="row"
            align="center"
          >
            <AppIcon placeholderIconType="app" size="md" appImg={currentAppData?.logo} />
            <Text size="large">{currentAppData?.label}</Text>
          </Box>
          <Box pad="none">
            {currentAppData?.subRoutes?.map((subRoute: IMenuItem, index: number) => (
              <Box pad={{ vertical: 'xsmall' }} key={index}>
                <IconLink
                  label={subRoute.label}
                  onClick={handleOptionClick(subRoute)}
                  active={subRoute.route === activeOption?.route}
                />
              </Box>
            ))}
          </Box>
        </SecondarySidebarContentWrapper>
      </SecondarySidebarBox>
    </Box>
  );
};

export { Sidebar };
