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

export interface ISidebarProps {
  loggedEthAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  menuItems: IMenuItem[];
  currentRoute?: string;
  onClickMenuItem: (route: string) => void;
  onClickAddApp: () => void;
  onClickSearch: () => void;
  onClickCloseSidebar: () => void;
  searchLabel: string;
  appCenterLabel: string;
}

export type MenuItemType = 'plugin' | 'app' | 'internal';
export interface IMenuItem {
  index: number;
  label: string;
  route: string;
  type: MenuItemType;
  logo?: string;
  subRoutes?: IMenuItem[];
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
    menuItems,
    onClickAddApp,
    onClickMenuItem,
    onClickSearch,
  } = props;

  // filter out default plugins like profile and feed
  const installedApps = menuItems.filter(menuItem => menuItem.type === 'app');

  const popoversRef: React.Ref<any> = React.useRef(installedApps?.map(() => React.createRef()));
  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const feedRef: React.Ref<HTMLDivElement> = React.useRef(null);

  // return the plugins from list of apps
  const profileDefaultData = menuItems.find(menuItem => menuItem.index === 2)!;
  const feedDefaultData = menuItems.find(menuItem => menuItem.index === 1)!;

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);

  const [hoveredAppData, setHoveredAppData] = React.useState<IMenuItem | null>(null);
  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);

  const handleMouseEnterProfile = () => {
    setHoveredAppData(profileDefaultData);
    setAppPopoverOpen(true);
  };

  const handleMouseEnterFeed = () => {
    setHoveredAppData(feedDefaultData);
    setAppPopoverOpen(true);
  };

  const [activeOption, setActiveOption] = React.useState('');

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    const firstAppData = menuItems[0];
    setCurrentAppData(firstAppData);
  }, []);

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    setCurrentAppData(menuItem);
    setHoveredAppData(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setActiveOption(menuItem.subRoutes[0].label);
    }
    onClickMenuItem(menuItem.route);
  };

  const handleClickProfile = handleAppIconClick(profileDefaultData);

  const handleClickFeed = handleAppIconClick(feedDefaultData);

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

  const handleMouseEnter = (menuItem: IMenuItem) => () => {
    setHoveredAppData(menuItem);
    setAppPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setAppPopoverOpen(false);
    setHoveredAppData(null);
  };

  const renderPopover = () => {
    if (appPopoverOpen && hoveredAppData) {
      if (profileRef.current && hoveredAppData.index === profileDefaultData.index) {
        return (
          <AppMenuPopover
            target={profileRef.current}
            closePopover={handleClosePopover}
            menuItem={hoveredAppData}
            onClickMenuItem={handlePopoverOptionClick}
          />
        );
      }
      if (feedRef.current && hoveredAppData.index === feedDefaultData.index) {
        return (
          <AppMenuPopover
            target={feedRef.current}
            closePopover={handleClosePopover}
            menuItem={hoveredAppData}
            onClickMenuItem={handlePopoverOptionClick}
          />
        );
      }
      if (popoversRef.current) {
        return (
          <AppMenuPopover
            target={popoversRef.current[hoveredAppData.index].current}
            closePopover={handleClosePopover}
            menuItem={hoveredAppData}
            onClickMenuItem={handlePopoverOptionClick}
          />
        );
      }
    }
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
              active={currentAppData?.index === profileDefaultData.index}
              hovered={hoveredAppData?.index === profileDefaultData.index}
              ref={profileRef}
            >
              <StyledAppIconWrapper
                active={currentAppData?.index === profileDefaultData.index}
                hovered={hoveredAppData?.index === profileDefaultData.index}
                onMouseEnter={handleMouseEnterProfile}
              >
                <Avatar
                  ethAddress={loggedEthAddress}
                  src={avatarImage}
                  size="sm"
                  onClick={handleClickProfile}
                />
              </StyledAppIconWrapper>
            </StyledBorderBox>
          </StyledVerticalPad>
          <StyledVerticalPad>
            <StyledBorderBox
              fill="horizontal"
              align="center"
              userSection={true}
              active={currentAppData?.index === feedDefaultData.index}
              hovered={hoveredAppData?.index === feedDefaultData.index}
              ref={feedRef}
            >
              <StyledAppIconWrapper
                active={currentAppData?.index === feedDefaultData.index}
                hovered={hoveredAppData?.index === feedDefaultData.index}
                onMouseEnter={handleMouseEnterFeed}
              >
                <AppIcon
                  placeholderIconType="ethereumWorldLogo"
                  onClick={handleClickFeed}
                  size="md"
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
            {installedApps.map((app, index) => (
              <StyledVerticalPad key={index}>
                <StyledBorderBox
                  fill="horizontal"
                  align="center"
                  active={index === currentAppData?.index}
                  hovered={index === hoveredAppData?.index}
                  ref={popoversRef.current[index]}
                >
                  <StyledAppIconWrapper
                    active={index === currentAppData?.index}
                    hovered={index === hoveredAppData?.index}
                    onMouseEnter={handleMouseEnter({ ...app, index })}
                  >
                    <AppIcon
                      placeholderIconType="app"
                      appImg={app.logo}
                      onClick={handleAppIconClick({ ...app, index })}
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
