import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import { AppMenuPopover } from '../../Popovers/index';
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

export interface InternalMenuItem extends IMenuItem {
  internalIndex: number;
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
  } = props;

  // keep profile plugin data consitent with the rest of the menu items and assign it an internal index
  // -1 since it will be outside the list of dynamic refs
  const internalProfilePluginData = profilePluginData
    ? { ...profilePluginData, internalIndex: -1 }
    : undefined;

  /*
  assign internal indexes to menu items, in order to reference the specific popovers
  we need a consistency betweeen the index of the dynamic ref of an installed app
  and its internalIndex so the compononet can keep track of what element
  is currently hovered and where should the popover appear
  */
  const internalMappedApps = installedApps?.map((app, index) => {
    return { ...app, internalIndex: index };
  });

  // iterate over the installed apps to create a ref for each one
  // this will be used to display the specific popover for a menu item
  const popoversRef: React.Ref<any> = React.useRef(
    internalMappedApps?.map(() => React.createRef()),
  );
  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);

  const [hoveredAppData, setHoveredAppData] = React.useState<InternalMenuItem | null>(null);
  const [currentAppData, setCurrentAppData] = React.useState<InternalMenuItem | null>(null);

  const [activeOption, setActiveOption] = React.useState('');

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    if (internalMappedApps) {
      setCurrentAppData(internalMappedApps[0]);
    }
  }, []);

  const handleAppIconClick = (menuItem: InternalMenuItem) => () => {
    setCurrentAppData(menuItem);
    setHoveredAppData(null);
    setAppPopoverOpen(false);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setActiveOption(menuItem.subRoutes[0].label);
    }
    onClickMenuItem(menuItem.route);
  };

  const handleOptionClick = (menuItem: IMenuItem) => () => {
    setActiveOption(menuItem.label);
    onClickMenuItem(menuItem.route);
  };

  const handlePopoverOptionClick = (subRoute: string) => {
    setCurrentAppData(hoveredAppData);
    setHoveredAppData(null);
    setActiveOption(subRoute);
    onClickMenuItem(subRoute);
  };

  const handleMouseEnter = (menuItem: InternalMenuItem) => () => {
    setHoveredAppData(menuItem);
    setAppPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setAppPopoverOpen(false);
    setHoveredAppData(null);
  };

  const renderPopover = () => {
    if (appPopoverOpen && hoveredAppData) {
      if (
        profileRef.current &&
        internalProfilePluginData &&
        hoveredAppData.label === internalProfilePluginData.label
      ) {
        return (
          <AppMenuPopover
            target={profileRef.current}
            closePopover={handleClosePopover}
            menuItem={hoveredAppData}
            onClickMenuItem={handlePopoverOptionClick}
          />
        );
      }
      if (popoversRef.current && popoversRef.current[hoveredAppData.internalIndex]) {
        return (
          <AppMenuPopover
            target={popoversRef.current[hoveredAppData.internalIndex].current}
            closePopover={handleClosePopover}
            menuItem={hoveredAppData}
            onClickMenuItem={handlePopoverOptionClick}
          />
        );
      }
    }
    return;
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
              active={
                internalProfilePluginData
                  ? currentAppData?.label === internalProfilePluginData.label
                  : false
              }
              hovered={
                internalProfilePluginData
                  ? hoveredAppData?.label === internalProfilePluginData.label
                  : false
              }
              ref={profileRef}
            >
              <StyledAppIconWrapper
                active={
                  internalProfilePluginData
                    ? currentAppData?.label === internalProfilePluginData.label
                    : false
                }
                hovered={
                  internalProfilePluginData
                    ? hoveredAppData?.label === internalProfilePluginData.label
                    : false
                }
                onMouseEnter={
                  internalProfilePluginData ? handleMouseEnter(internalProfilePluginData) : noop
                }
              >
                <Avatar
                  ethAddress={loggedEthAddress}
                  src={avatarImage}
                  size="sm"
                  onClick={
                    internalProfilePluginData ? handleAppIconClick(internalProfilePluginData) : noop
                  }
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
            {internalMappedApps?.map((app, index) => (
              <StyledVerticalPad key={index}>
                <StyledBorderBox
                  fill="horizontal"
                  align="center"
                  active={index === currentAppData?.internalIndex}
                  hovered={index === hoveredAppData?.internalIndex}
                  ref={popoversRef.current[index]}
                >
                  <StyledAppIconWrapper
                    active={index === currentAppData?.internalIndex}
                    hovered={index === hoveredAppData?.internalIndex}
                    onMouseEnter={handleMouseEnter(app)}
                  >
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
          {renderPopover()}
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
                  active={subRoute.label === activeOption}
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
