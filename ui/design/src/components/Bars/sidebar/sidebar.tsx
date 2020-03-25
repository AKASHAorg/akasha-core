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
  ethAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  installedApps: IApp[];
  currentRoute?: string;
  onClickOption: (route: IRouteParams) => void;
  onClickAddApp: () => void;
  onClickSearch: () => void;
  onClickCloseSidebar: () => void;
  searchLabel: string;
  appCenterLabel: string;
}

export interface IRouteParams {
  appName: string;
  appSubroute: string;
}

export interface IApp {
  name: string;
  image?: string;
  ethAddress: string;
  options: string[];
}

export interface IAppIndexed {
  name: string;
  image?: string;
  ethAddress: string;
  options: string[];
  index: number | string;
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
    ethAddress,
    // notifications,
    installedApps,
    onClickAddApp,
    onClickOption,
    onClickSearch,
  } = props;

  const popoversRef: React.Ref<any> = React.useRef(installedApps?.map(() => React.createRef()));
  const profileRef: React.Ref<any> = React.useRef(null);
  const feedRef: React.Ref<any> = React.useRef(null);

  const initialAppData = {
    name: '',
    ethAddress: '',
    image: '',
    options: [],
    index: -1,
  };

  const profileDefaultData = {
    name: 'My World',
    ethAddress: ethAddress,
    options: ['My Profile', 'My Apps', 'Settings'],
    index: 'profile',
  };

  const feedDefaultData = {
    name: 'Feed',
    ethAddress: ethAddress,
    options: ['My Feed', 'Settings'],
    index: 'feed',
  };

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);

  const [hoveredAppData, setHoveredAppData] = React.useState<IAppIndexed>(initialAppData);
  const [currentAppData, setCurrentAppData] = React.useState<IAppIndexed>(initialAppData);

  const handleMouseEnterProfile = () => {
    setHoveredAppData(profileDefaultData);
    setAppPopoverOpen(true);
  };

  const handleMouseEnterFeed = () => {
    setHoveredAppData(feedDefaultData);
    setAppPopoverOpen(true);
  };

  const handleClickProfile = () => {
    setCurrentAppData(profileDefaultData);
    setHoveredAppData(profileDefaultData);
  };

  const handleClickFeed = () => {
    setCurrentAppData(feedDefaultData);
    setHoveredAppData(feedDefaultData);
  };

  const [activeOption, setActiveOption] = React.useState(currentAppData.options[0]);

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    const firstAppData = { ...installedApps[0], index: 0 };
    setCurrentAppData(firstAppData);
    setActiveOption(firstAppData.options[0]);
  }, []);

  const handleAppIconClick = (appData: IAppIndexed) => () => {
    setCurrentAppData(appData);
    setHoveredAppData(appData);
    setActiveOption(appData.options[0]);
    onClickOption({ appName: appData.name, appSubroute: appData.options[0] });
  };

  const handleOptionClick = (name: string, option: string) => () => {
    setActiveOption(option);
    onClickOption({ appName: name, appSubroute: option });
  };

  const handlePopoverOptionClick = (option: string) => {
    setCurrentAppData(hoveredAppData);
    setHoveredAppData(initialAppData);
    setActiveOption(option);
    onClickOption({ appName: hoveredAppData.name, appSubroute: option });
  };

  const handleMouseEnter = (appData: IAppIndexed) => () => {
    setHoveredAppData(appData);
    setAppPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setAppPopoverOpen(false);
    setHoveredAppData(initialAppData);
  };

  const renderPopover = () => {
    if (appPopoverOpen && hoveredAppData) {
      if (profileRef.current && hoveredAppData.index === profileDefaultData.index) {
        return (
          <AppMenuPopover
            target={profileRef.current}
            closePopover={handleClosePopover}
            appData={hoveredAppData}
            onClickOption={handlePopoverOptionClick}
          />
        );
      }
      if (feedRef.current && hoveredAppData.index === feedDefaultData.index) {
        return (
          <AppMenuPopover
            target={feedRef.current}
            closePopover={handleClosePopover}
            appData={hoveredAppData}
            onClickOption={handlePopoverOptionClick}
          />
        );
      }
      if (popoversRef.current) {
        return (
          <AppMenuPopover
            target={popoversRef.current[hoveredAppData.index].current}
            closePopover={handleClosePopover}
            appData={hoveredAppData}
            onClickOption={handlePopoverOptionClick}
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
              active={currentAppData.index === profileDefaultData.index}
              hovered={hoveredAppData.index === profileDefaultData.index}
              ref={profileRef}
            >
              <StyledAppIconWrapper
                active={currentAppData.index === profileDefaultData.index}
                hovered={hoveredAppData.index === profileDefaultData.index}
                onMouseEnter={handleMouseEnterProfile}
              >
                <Avatar
                  ethAddress={ethAddress}
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
              active={currentAppData.index === feedDefaultData.index}
              hovered={hoveredAppData.index === feedDefaultData.index}
              ref={feedRef}
            >
              <StyledAppIconWrapper
                active={currentAppData.index === feedDefaultData.index}
                hovered={hoveredAppData.index === feedDefaultData.index}
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
                  active={index === currentAppData.index}
                  hovered={index === hoveredAppData.index}
                  ref={popoversRef.current[index]}
                >
                  <StyledAppIconWrapper
                    active={index === currentAppData.index}
                    hovered={index === hoveredAppData.index}
                    onMouseEnter={handleMouseEnter({ ...app, index })}
                  >
                    <AppIcon
                      placeholderIconType="app"
                      appImg={app.image}
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
            <AppIcon placeholderIconType="app" size="md" appImg={currentAppData.image} />
            <Text size="large">{currentAppData.name}</Text>
          </Box>
          <Box pad="none">
            {currentAppData.options?.map((option, index) => (
              <Box pad={{ vertical: 'xsmall' }} key={index}>
                <IconLink
                  label={option}
                  onClick={handleOptionClick(currentAppData.name, option)}
                  active={option === activeOption}
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
